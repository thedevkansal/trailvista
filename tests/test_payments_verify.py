"""Unit tests for /payments/verify with mocked Razorpay and Supabase PostgREST.

Run: pip install -r backend/requirements.txt pytest httpx && pytest tests/
"""
import hashlib
import hmac
import sys
from pathlib import Path

import pytest

BACKEND_DIR = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(BACKEND_DIR))

from fastapi import FastAPI  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402

import payments  # noqa: E402
from trek_prices import TREK_PRICES  # noqa: E402

KEY_SECRET = "test_razorpay_secret"
USER_ID = "11111111-1111-1111-1111-111111111111"
OTHER_USER_ID = "22222222-2222-2222-2222-222222222222"
USER_EMAIL = "owner@example.com"
CHEAP_TREK = "kedarkantha-trek"
EXPENSIVE_TREK = "stok-kangri-expedition"
ORDER_ID = "order_test123"
PAYMENT_ID = "pay_test123"


def _sign(order_id: str, payment_id: str) -> str:
    return hmac.new(
        KEY_SECRET.encode(), f"{order_id}|{payment_id}".encode(), hashlib.sha256
    ).hexdigest()


def _order(trek_id=CHEAP_TREK, user_id=USER_ID, amount=None, currency="INR"):
    return {
        "id": ORDER_ID,
        "amount": int(TREK_PRICES[trek_id] * 100) if amount is None else amount,
        "currency": currency,
        "notes": {"trek_id": trek_id, "user_id": user_id},
    }


class FakeResponse:
    def __init__(self, status_code, payload):
        self.status_code = status_code
        self._payload = payload
        self.text = str(payload)

    def json(self):
        return self._payload


class FakeRazorpay:
    def __init__(self, order):
        self.order = self._Orders(order)
        self.payment = self._Payments()

    class _Orders:
        def __init__(self, order):
            self._order = order

        def fetch(self, order_id):
            assert order_id == ORDER_ID
            return self._order

    class _Payments:
        def fetch(self, payment_id):
            return {"email": "razorpay-fallback@example.com", "notes": {}}


class FakeSupabase:
    """Stands in for requests.get/post against the bookings PostgREST endpoint."""

    def __init__(self, existing=None):
        self.existing = existing
        self.inserted = []

    def get(self, url, params=None, headers=None, timeout=None):
        assert url.endswith("/rest/v1/bookings")
        return FakeResponse(200, [self.existing] if self.existing else [])

    def post(self, url, headers=None, json=None, timeout=None):
        assert url.endswith("/rest/v1/bookings")
        self.inserted.append(json)
        return FakeResponse(201, [{"id": "booking-1", "created_at": "2026-10-19T00:00:00Z", **json}])


@pytest.fixture
def setup(monkeypatch):
    monkeypatch.setenv("RAZORPAY_KEY_ID", "rzp_test_key")
    monkeypatch.setenv("RAZORPAY_KEY_SECRET", KEY_SECRET)
    monkeypatch.setenv("SUPABASE_URL", "https://example.supabase.co")
    monkeypatch.setenv("SUPABASE_SERVICE_ROLE_KEY", "service_role_test")

    sent_emails = []
    monkeypatch.setattr(
        payments,
        "send_booking_confirmation_email",
        lambda to, details: sent_emails.append((to, details)) or True,
    )

    app = FastAPI()
    app.include_router(payments.payments_router)
    app.dependency_overrides[payments.get_current_user] = lambda: {
        "id": USER_ID,
        "email": USER_EMAIL,
        "user_metadata": {"full_name": "Owner"},
    }

    def configure(order, existing=None):
        supabase = FakeSupabase(existing=existing)
        monkeypatch.setattr(payments.requests, "get", supabase.get)
        monkeypatch.setattr(payments.requests, "post", supabase.post)
        monkeypatch.setattr(payments, "get_razorpay_client", lambda: FakeRazorpay(order))
        return supabase

    return TestClient(app), configure, sent_emails


def _verify_body(trek_id, **extra):
    return {
        "razorpay_order_id": ORDER_ID,
        "razorpay_payment_id": PAYMENT_ID,
        "razorpay_signature": _sign(ORDER_ID, PAYMENT_ID),
        "trek_id": trek_id,
        **extra,
    }


def test_trek_mismatch_rejected(setup):
    client, configure, sent_emails = setup
    supabase = configure(_order(trek_id=CHEAP_TREK))

    # Paid for the cheap trek, tries to book the expensive one.
    resp = client.post(
        "/payments/verify",
        json=_verify_body(EXPENSIVE_TREK, amount=TREK_PRICES[EXPENSIVE_TREK]),
    )

    assert resp.status_code == 400
    assert supabase.inserted == []
    assert sent_emails == []


def test_user_mismatch_rejected(setup):
    client, configure, sent_emails = setup
    supabase = configure(_order(user_id=OTHER_USER_ID))

    resp = client.post("/payments/verify", json=_verify_body(CHEAP_TREK))

    assert resp.status_code == 400
    assert supabase.inserted == []
    assert sent_emails == []


@pytest.mark.parametrize(
    "order",
    [
        _order(amount=100),
        _order(currency="USD"),
        {"id": ORDER_ID, "amount": 899900, "currency": "INR", "notes": []},
    ],
    ids=["amount", "currency", "no-notes"],
)
def test_order_amount_currency_or_notes_mismatch_rejected(setup, order):
    client, configure, _ = setup
    supabase = configure(order)

    resp = client.post("/payments/verify", json=_verify_body(CHEAP_TREK))

    assert resp.status_code == 400
    assert supabase.inserted == []


def test_bad_signature_rejected(setup):
    client, configure, _ = setup
    configure(_order())
    body = _verify_body(CHEAP_TREK)
    body["razorpay_signature"] = "0" * 64

    resp = client.post("/payments/verify", json=body)

    assert resp.status_code == 400


def test_existing_booking_of_other_user_returns_409(setup):
    client, configure, sent_emails = setup
    existing = {
        "id": "booking-other",
        "user_id": OTHER_USER_ID,
        "trek_id": CHEAP_TREK,
        "razorpay_payment_id": PAYMENT_ID,
    }
    supabase = configure(_order(), existing=existing)

    resp = client.post("/payments/verify", json=_verify_body(CHEAP_TREK))

    assert resp.status_code == 409
    assert supabase.inserted == []
    assert sent_emails == []


def test_existing_booking_of_same_user_returned(setup):
    client, configure, sent_emails = setup
    existing = {
        "id": "booking-mine",
        "user_id": USER_ID,
        "trek_id": CHEAP_TREK,
        "razorpay_payment_id": PAYMENT_ID,
    }
    supabase = configure(_order(), existing=existing)

    resp = client.post("/payments/verify", json=_verify_body(CHEAP_TREK))

    assert resp.status_code == 200
    assert resp.json()["booking"]["id"] == "booking-mine"
    assert supabase.inserted == []
    assert [to for to, _ in sent_emails] == [USER_EMAIL]


def test_happy_path_books_order_trek_and_emails_jwt_address(setup):
    client, configure, sent_emails = setup
    supabase = configure(_order())

    resp = client.post(
        "/payments/verify",
        json=_verify_body(
            CHEAP_TREK,
            amount=TREK_PRICES[CHEAP_TREK],
            user_email="attacker@example.com",
            departure_date="2026-02-15",
        ),
    )

    assert resp.status_code == 200
    data = resp.json()
    assert data["success"] is True
    assert data["email_to"] == USER_EMAIL

    assert len(supabase.inserted) == 1
    row = supabase.inserted[0]
    assert row["user_id"] == USER_ID
    assert row["trek_id"] == CHEAP_TREK
    assert row["amount"] == TREK_PRICES[CHEAP_TREK]
    assert row["currency"] == "INR"
    assert row["departure_date"] == "2026-02-15"

    assert [to for to, _ in sent_emails] == [USER_EMAIL]


def test_invalid_departure_date_is_dropped(setup):
    client, configure, _ = setup
    supabase = configure(_order())

    resp = client.post("/payments/verify", json=_verify_body(CHEAP_TREK, departure_date=""))

    assert resp.status_code == 200
    assert "departure_date" not in supabase.inserted[0]


def test_create_order_ignores_client_currency(setup, monkeypatch):
    client, _, _ = setup
    created = []

    class Orders:
        def create(self, data):
            created.append(data)
            return {"id": ORDER_ID, **data}

    class Client:
        order = Orders()

    monkeypatch.setattr(payments, "get_razorpay_client", lambda: Client())
    app = client.app
    app.dependency_overrides[payments.get_current_user_id] = lambda: USER_ID

    resp = client.post("/payments/create-order", json={"trek_id": CHEAP_TREK, "currency": "USD"})

    assert resp.status_code == 200
    assert created[0]["currency"] == "INR"
    assert created[0]["amount"] == int(TREK_PRICES[CHEAP_TREK] * 100)
    assert created[0]["notes"] == {"trek_id": CHEAP_TREK, "user_id": USER_ID}
