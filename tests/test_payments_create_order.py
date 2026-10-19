"""Tests for POST /payments/create-order."""
from tests.conftest import CHEAP_TREK, TREK_PRICES, USER_ID


def test_invalid_trek_rejected(harness):
    resp = harness.client.post("/payments/create-order", json={"trek_id": "not-a-trek"})

    assert resp.status_code == 400
    assert harness.razorpay.created_orders == []


def test_amount_comes_from_server_price_and_currency_forced_to_inr(harness):
    resp = harness.client.post(
        "/payments/create-order", json={"trek_id": CHEAP_TREK, "currency": "USD"}
    )

    assert resp.status_code == 200
    created = harness.razorpay.created_orders[0]
    assert created["currency"] == "INR"
    assert created["amount"] == int(TREK_PRICES[CHEAP_TREK] * 100)
    assert resp.json()["currency"] == "INR"
    assert resp.json()["amount"] == created["amount"]


def test_notes_bind_trek_and_user(harness):
    harness.client.post("/payments/create-order", json={"trek_id": CHEAP_TREK})

    assert harness.razorpay.created_orders[0]["notes"] == {"trek_id": CHEAP_TREK, "user_id": USER_ID}


def test_departure_date_stored_in_notes(harness):
    resp = harness.client.post(
        "/payments/create-order", json={"trek_id": CHEAP_TREK, "departure_date": "2026-02-15"}
    )

    assert resp.status_code == 200
    assert harness.razorpay.created_orders[0]["notes"] == {
        "trek_id": CHEAP_TREK,
        "user_id": USER_ID,
        "departure_date": "2026-02-15",
    }


def test_invalid_departure_date_rejected(harness):
    resp = harness.client.post(
        "/payments/create-order", json={"trek_id": CHEAP_TREK, "departure_date": "15/02/2026"}
    )

    assert resp.status_code == 400
    assert harness.razorpay.created_orders == []


def test_empty_departure_date_ignored(harness):
    resp = harness.client.post(
        "/payments/create-order", json={"trek_id": CHEAP_TREK, "departure_date": ""}
    )

    assert resp.status_code == 200
    assert "departure_date" not in harness.razorpay.created_orders[0]["notes"]


def test_debug_test_email_endpoint_removed(harness):
    resp = harness.client.post(
        "/payments/debug/send-test-email", json={"recipient_email": "x@example.com"}
    )

    assert resp.status_code in (404, 405)
    assert harness.sent_emails == []
