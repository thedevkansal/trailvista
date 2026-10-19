"""Tests for POST /payments/webhook (Razorpay webhooks)."""
import hashlib
import hmac
import json

import pytest

from tests.conftest import (
    CHEAP_TREK,
    ORDER_ID,
    OTHER_USER_ID,
    PAYMENT_ID,
    TREK_PRICES,
    USER_EMAIL,
    USER_ID,
    WEBHOOK_SECRET,
    make_order,
    sign,
)


def payment_entity(amount=None, currency="INR", status="captured", email="payer@example.com"):
    return {
        "id": PAYMENT_ID,
        "entity": "payment",
        "order_id": ORDER_ID,
        "amount": int(TREK_PRICES[CHEAP_TREK] * 100) if amount is None else amount,
        "currency": currency,
        "status": status,
        "email": email,
        "notes": {},
    }


def event(name="payment.captured", payment=None, order=None):
    payload = {"payment": {"entity": payment or payment_entity()}}
    if order is not None:
        payload["order"] = {"entity": order}
    return {"entity": "event", "event": name, "payload": payload}


def post_webhook(harness, body, secret=WEBHOOK_SECRET, signature=None):
    raw = json.dumps(body).encode()
    if signature is None:
        signature = hmac.new(secret.encode(), raw, hashlib.sha256).hexdigest()
    return harness.client.post(
        "/payments/webhook",
        content=raw,
        headers={"Content-Type": "application/json", "X-Razorpay-Signature": signature},
    )


def test_bad_signature_rejected(harness):
    supabase = harness.configure(make_order())

    resp = post_webhook(harness, event(), secret="wrong-secret")

    assert resp.status_code == 400
    assert supabase.inserted == []


def test_missing_signature_rejected(harness):
    supabase = harness.configure(make_order())

    resp = harness.client.post("/payments/webhook", json=event())

    assert resp.status_code == 400
    assert supabase.inserted == []


def test_signature_over_different_body_rejected(harness):
    supabase = harness.configure(make_order())
    original = json.dumps(event()).encode()
    signature = hmac.new(WEBHOOK_SECRET.encode(), original, hashlib.sha256).hexdigest()
    tampered = event(payment=payment_entity(amount=100))

    resp = post_webhook(harness, tampered, signature=signature)

    assert resp.status_code == 400
    assert supabase.inserted == []


def test_missing_webhook_secret_returns_500(harness, monkeypatch):
    monkeypatch.delenv("RAZORPAY_WEBHOOK_SECRET")
    supabase = harness.configure(make_order())

    resp = post_webhook(harness, event())

    assert resp.status_code == 500
    assert supabase.inserted == []


def test_payment_captured_inserts_booking_from_order_notes(harness):
    supabase = harness.configure(make_order(departure_date="2026-02-15"))

    resp = post_webhook(harness, event("payment.captured"))

    assert resp.status_code == 200
    assert resp.json()["created"] is True
    assert harness.razorpay.fetched_orders == [ORDER_ID]
    assert len(supabase.inserted) == 1
    row = supabase.inserted[0]
    assert row["user_id"] == USER_ID
    assert row["trek_id"] == CHEAP_TREK
    assert row["amount"] == TREK_PRICES[CHEAP_TREK]
    assert row["currency"] == "INR"
    assert row["razorpay_order_id"] == ORDER_ID
    assert row["razorpay_payment_id"] == PAYMENT_ID
    assert row["departure_date"] == "2026-02-15"
    # Account email from Supabase, not the payer email on the Razorpay payment.
    assert harness.email_recipients == [USER_EMAIL]


def test_order_paid_uses_embedded_order(harness):
    supabase = harness.configure(order=None)

    resp = post_webhook(harness, event("order.paid", order=make_order()))

    assert resp.status_code == 200
    assert harness.razorpay.fetched_orders == []
    assert len(supabase.inserted) == 1


def test_duplicate_webhook_does_not_insert_twice(harness):
    supabase = harness.configure(make_order())

    first = post_webhook(harness, event("payment.captured"))
    second = post_webhook(harness, event("payment.captured"))
    third = post_webhook(harness, event("order.paid", order=make_order()))

    assert [r.status_code for r in (first, second, third)] == [200, 200, 200]
    assert [r.json()["created"] for r in (first, second, third)] == [True, False, False]
    assert len(supabase.inserted) == 1
    assert harness.email_recipients == [USER_EMAIL]


def test_webhook_then_verify_shares_one_booking(harness):
    supabase = harness.configure(make_order())

    hook = post_webhook(harness, event())
    verify = harness.client.post(
        "/payments/verify",
        json={
            "razorpay_order_id": ORDER_ID,
            "razorpay_payment_id": PAYMENT_ID,
            "razorpay_signature": sign(),
            "trek_id": CHEAP_TREK,
        },
    )

    assert hook.status_code == 200
    assert verify.status_code == 200
    assert verify.json()["booking"]["id"] == hook.json()["booking_id"]
    assert len(supabase.inserted) == 1
    assert harness.email_recipients == [USER_EMAIL]


def test_verify_then_webhook_shares_one_booking(harness):
    supabase = harness.configure(make_order())

    verify = harness.client.post(
        "/payments/verify",
        json={
            "razorpay_order_id": ORDER_ID,
            "razorpay_payment_id": PAYMENT_ID,
            "razorpay_signature": sign(),
            "trek_id": CHEAP_TREK,
        },
    )
    hook = post_webhook(harness, event())

    assert verify.status_code == 200
    assert hook.json()["created"] is False
    assert len(supabase.inserted) == 1
    assert harness.email_recipients == [USER_EMAIL]


@pytest.mark.parametrize(
    "order,payment",
    [
        (make_order(amount=100), payment_entity(amount=100)),
        (make_order(currency="USD"), payment_entity()),
        (make_order(), payment_entity(amount=100)),
        ({"id": ORDER_ID, "amount": 899900, "currency": "INR", "notes": {}}, payment_entity()),
    ],
    ids=["order-amount", "order-currency", "payment-amount", "no-notes"],
)
def test_mismatched_order_or_payment_not_booked(harness, order, payment):
    supabase = harness.configure(order)

    resp = post_webhook(harness, event(payment=payment))

    assert resp.status_code == 200
    assert resp.json()["status"] == "rejected"
    assert supabase.inserted == []


def test_uncaptured_payment_ignored(harness):
    supabase = harness.configure(make_order())

    resp = post_webhook(harness, event(payment=payment_entity(status="authorized")))

    assert resp.status_code == 200
    assert resp.json()["status"] == "ignored"
    assert supabase.inserted == []


def test_unrelated_event_ignored(harness):
    supabase = harness.configure(make_order())

    resp = post_webhook(harness, event("refund.created"))

    assert resp.status_code == 200
    assert resp.json()["status"] == "ignored"
    assert supabase.inserted == []


def test_payment_booked_under_other_user_not_reassigned(harness):
    existing = {
        "id": "booking-other",
        "user_id": OTHER_USER_ID,
        "trek_id": CHEAP_TREK,
        "razorpay_payment_id": PAYMENT_ID,
    }
    supabase = harness.configure(make_order(), existing=existing)

    resp = post_webhook(harness, event())

    assert resp.status_code == 200
    assert resp.json()["status"] == "conflict"
    assert supabase.inserted == []
    assert harness.sent_emails == []


def test_razorpay_order_fetch_failure_returns_502_for_retry(harness):
    supabase = harness.configure(make_order())

    def boom(order_id):
        raise RuntimeError("razorpay down")

    harness.razorpay.order.fetch = boom

    resp = post_webhook(harness, event("payment.captured"))

    assert resp.status_code == 502
    assert supabase.inserted == []
