"""Tests for POST /payments/verify."""
import pytest

from tests.conftest import (
    CHEAP_TREK,
    EXPENSIVE_TREK,
    ORDER_ID,
    OTHER_USER_ID,
    PAYMENT_ID,
    TREK_PRICES,
    USER_EMAIL,
    USER_ID,
    make_order,
    sign,
)


def verify_body(trek_id=CHEAP_TREK, **extra):
    return {
        "razorpay_order_id": ORDER_ID,
        "razorpay_payment_id": PAYMENT_ID,
        "razorpay_signature": sign(),
        "trek_id": trek_id,
        **extra,
    }


def test_bad_signature_rejected(harness):
    supabase = harness.configure(make_order())

    resp = harness.client.post(
        "/payments/verify", json=verify_body(razorpay_signature="0" * 64)
    )

    assert resp.status_code == 400
    assert harness.razorpay.fetched_orders == []
    assert supabase.inserted == []


def test_trek_mismatch_rejected(harness):
    supabase = harness.configure(make_order(trek_id=CHEAP_TREK))

    # Paid for the cheap trek, tries to book the expensive one.
    resp = harness.client.post(
        "/payments/verify",
        json=verify_body(EXPENSIVE_TREK, amount=TREK_PRICES[EXPENSIVE_TREK]),
    )

    assert resp.status_code == 400
    assert supabase.inserted == []
    assert harness.sent_emails == []


def test_user_mismatch_rejected(harness):
    supabase = harness.configure(make_order(user_id=OTHER_USER_ID))

    resp = harness.client.post("/payments/verify", json=verify_body())

    assert resp.status_code == 400
    assert supabase.inserted == []
    assert harness.sent_emails == []


@pytest.mark.parametrize(
    "order",
    [
        make_order(amount=100),
        make_order(currency="USD"),
        {"id": ORDER_ID, "amount": 899900, "currency": "INR", "notes": []},
    ],
    ids=["order-amount", "order-currency", "order-without-notes"],
)
def test_order_amount_currency_or_notes_mismatch_rejected(harness, order):
    supabase = harness.configure(order)

    resp = harness.client.post("/payments/verify", json=verify_body())

    assert resp.status_code == 400
    assert supabase.inserted == []


def test_client_amount_mismatch_rejected(harness):
    supabase = harness.configure(make_order())

    resp = harness.client.post("/payments/verify", json=verify_body(amount=1))

    assert resp.status_code == 400
    assert supabase.inserted == []


def test_razorpay_order_fetch_failure_returns_502(harness):
    supabase = harness.configure(make_order())

    def boom(order_id):
        raise RuntimeError("razorpay down")

    harness.razorpay.order.fetch = boom

    resp = harness.client.post("/payments/verify", json=verify_body())

    assert resp.status_code == 502
    assert supabase.inserted == []


def test_existing_booking_of_other_user_returns_409(harness):
    existing = {
        "id": "booking-other",
        "user_id": OTHER_USER_ID,
        "trek_id": CHEAP_TREK,
        "razorpay_payment_id": PAYMENT_ID,
    }
    supabase = harness.configure(make_order(), existing=existing)

    resp = harness.client.post("/payments/verify", json=verify_body())

    assert resp.status_code == 409
    assert supabase.inserted == []
    assert harness.sent_emails == []


def test_existing_booking_of_same_user_returned(harness):
    existing = {
        "id": "booking-mine",
        "user_id": USER_ID,
        "trek_id": CHEAP_TREK,
        "razorpay_payment_id": PAYMENT_ID,
    }
    supabase = harness.configure(make_order(), existing=existing)

    resp = harness.client.post("/payments/verify", json=verify_body())

    assert resp.status_code == 200
    assert resp.json()["booking"]["id"] == "booking-mine"
    assert supabase.inserted == []
    assert harness.email_recipients == [USER_EMAIL]


def test_repeat_verify_is_idempotent(harness):
    supabase = harness.configure(make_order())

    first = harness.client.post("/payments/verify", json=verify_body())
    second = harness.client.post("/payments/verify", json=verify_body())

    assert first.status_code == 200
    assert second.status_code == 200
    assert len(supabase.inserted) == 1
    assert first.json()["booking"]["id"] == second.json()["booking"]["id"]


def test_happy_path_books_order_trek_and_emails_jwt_address(harness):
    supabase = harness.configure(make_order())

    resp = harness.client.post(
        "/payments/verify",
        json=verify_body(
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
    assert row["razorpay_order_id"] == ORDER_ID
    assert row["razorpay_payment_id"] == PAYMENT_ID
    assert row["departure_date"] == "2026-02-15"

    assert harness.email_recipients == [USER_EMAIL]


def test_departure_date_from_order_notes_wins_over_body(harness):
    supabase = harness.configure(make_order(departure_date="2026-03-01"))

    resp = harness.client.post("/payments/verify", json=verify_body(departure_date="2026-02-15"))

    assert resp.status_code == 200
    assert supabase.inserted[0]["departure_date"] == "2026-03-01"


def test_invalid_departure_date_is_dropped(harness):
    supabase = harness.configure(make_order())

    resp = harness.client.post("/payments/verify", json=verify_body(departure_date=""))

    assert resp.status_code == 200
    assert "departure_date" not in supabase.inserted[0]
