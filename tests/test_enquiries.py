import sys
from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest

BACKEND_DIR = Path(__file__).resolve().parent.parent / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from fastapi import FastAPI  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402

import enquiries  # noqa: E402

VALID_CONTACT = {
    "source": "contact",
    "name": "Asha Rao",
    "email": "Asha@Example.com",
    "phone": "+91 98765 43210",
    "subject": "booking",
    "message": "Can I join the December batch?",
}

VALID_TREK = {
    "source": "trek",
    "name": "Ravi",
    "email": "ravi@example.com",
    "phone": "9876543210",
    "trek_name": "Kedarkantha Trek",
    "travel_month": "December 2026",
    "group_size": 4,
}


@pytest.fixture
def client(monkeypatch):
    monkeypatch.setenv("SUPABASE_URL", "https://example.supabase.co")
    monkeypatch.setenv("SUPABASE_SERVICE_ROLE_KEY", "service-role-test-key")
    app = FastAPI()
    app.include_router(enquiries.enquiries_router, prefix="/api")
    enquiries.reset_rate_limits()
    return TestClient(app)


@pytest.fixture
def supabase_ok():
    response = MagicMock(status_code=201, text="")
    with patch.object(enquiries.requests, "post", return_value=response) as post:
        yield post


def test_contact_enquiry_is_saved(client, supabase_ok):
    res = client.post("/api/enquiries", json=VALID_CONTACT)

    assert res.status_code == 201
    assert res.json() == {"success": True}
    url = supabase_ok.call_args.args[0]
    row = supabase_ok.call_args.kwargs["json"]
    assert url == "https://example.supabase.co/rest/v1/enquiries"
    assert row["email"] == "asha@example.com"
    assert row["source"] == "contact"
    assert row["subject"] == "booking"
    assert "website" not in row


def test_trek_enquiry_is_saved(client, supabase_ok):
    res = client.post("/api/enquiries", json=VALID_TREK)

    assert res.status_code == 201
    row = supabase_ok.call_args.kwargs["json"]
    assert row["trek_name"] == "Kedarkantha Trek"
    assert row["group_size"] == 4


def test_uses_service_role_key(client, supabase_ok):
    client.post("/api/enquiries", json=VALID_CONTACT)

    headers = supabase_ok.call_args.kwargs["headers"]
    assert headers["Authorization"] == "Bearer service-role-test-key"


@pytest.mark.parametrize(
    "override",
    [
        {"email": "not-an-email"},
        {"name": ""},
        {"name": "x" * 101},
        {"phone": "call me maybe"},
        {"source": "admin"},
        {"subject": "hacking"},
        {"group_size": 0},
        {"group_size": 500},
        {"message": "x" * 2001},
    ],
)
def test_rejects_invalid_input(client, supabase_ok, override):
    res = client.post("/api/enquiries", json={**VALID_CONTACT, **override})

    assert res.status_code == 422
    supabase_ok.assert_not_called()


def test_honeypot_pretends_success_without_saving(client, supabase_ok):
    res = client.post("/api/enquiries", json={**VALID_CONTACT, "website": "http://spam.example"})

    assert res.status_code == 201
    supabase_ok.assert_not_called()


def test_rate_limits_repeat_submissions(client, supabase_ok):
    for _ in range(enquiries.PER_CLIENT_LIMIT):
        assert client.post("/api/enquiries", json=VALID_CONTACT).status_code == 201

    res = client.post("/api/enquiries", json=VALID_CONTACT)

    assert res.status_code == 429
    assert supabase_ok.call_count == enquiries.PER_CLIENT_LIMIT


def test_rate_limit_is_per_client(client, supabase_ok):
    for _ in range(enquiries.PER_CLIENT_LIMIT):
        client.post("/api/enquiries", json=VALID_CONTACT, headers={"X-Forwarded-For": "1.1.1.1"})

    res = client.post("/api/enquiries", json=VALID_CONTACT, headers={"X-Forwarded-For": "2.2.2.2"})

    assert res.status_code == 201


def test_supabase_failure_returns_502(client):
    response = MagicMock(status_code=500, text="boom")
    with patch.object(enquiries.requests, "post", return_value=response):
        res = client.post("/api/enquiries", json=VALID_CONTACT)

    assert res.status_code == 502


def test_notifies_team_when_configured(client, supabase_ok, monkeypatch):
    monkeypatch.setenv("ENQUIRY_NOTIFY_EMAIL", "team@example.com")
    with patch.object(enquiries, "send_enquiry_notification") as notify:
        client.post("/api/enquiries", json=VALID_TREK)

    notify.assert_called_once()
    to_email, row = notify.call_args.args
    assert to_email == "team@example.com"
    assert row["name"] == "Ravi"


def test_no_notification_without_config(client, supabase_ok, monkeypatch):
    monkeypatch.delenv("ENQUIRY_NOTIFY_EMAIL", raising=False)
    with patch.object(enquiries, "send_enquiry_notification") as notify:
        client.post("/api/enquiries", json=VALID_TREK)

    notify.assert_not_called()


def test_notification_email_escapes_html_and_sets_reply_to():
    import email_service

    with patch.object(email_service, "_deliver", return_value=True) as deliver:
        email_service.send_enquiry_notification(
            "team@example.com",
            {"source": "contact", "name": "<script>x</script>\nBcc: evil@example.com", "email": "a@b.co", "phone": "123"},
        )

    to_email, subject, _text, html_body = deliver.call_args.args
    assert to_email == "team@example.com"
    assert "\n" not in subject
    assert "<script>" not in html_body
    assert deliver.call_args.kwargs["reply_to"] == "a@b.co"
