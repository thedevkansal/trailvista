"""Tests for POST /payments/create-order."""
from datetime import date

import pytest

import payments
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


@pytest.fixture
def fixed_today(monkeypatch):
    monkeypatch.setattr(payments, "_today_ist", lambda: date(2026, 10, 19))


def test_departure_date_stored_in_notes(harness, fixed_today):
    resp = harness.client.post(
        "/payments/create-order", json={"trek_id": CHEAP_TREK, "departure_date": "2027-02-15"}
    )

    assert resp.status_code == 200
    assert harness.razorpay.created_orders[0]["notes"] == {
        "trek_id": CHEAP_TREK,
        "user_id": USER_ID,
        "departure_date": "2027-02-15",
    }


def test_past_departure_date_rejected(harness, fixed_today):
    resp = harness.client.post(
        "/payments/create-order", json={"trek_id": CHEAP_TREK, "departure_date": "2026-02-15"}
    )

    assert resp.status_code == 400
    assert resp.json()["detail"] == "This departure date has already passed."
    assert harness.razorpay.created_orders == []


def test_yesterday_rejected_today_allowed(harness, fixed_today):
    yesterday = harness.client.post(
        "/payments/create-order", json={"trek_id": CHEAP_TREK, "departure_date": "2026-10-18"}
    )
    today = harness.client.post(
        "/payments/create-order", json={"trek_id": CHEAP_TREK, "departure_date": "2026-10-19"}
    )

    assert yesterday.status_code == 400
    assert today.status_code == 200


def test_today_ist_uses_india_time(monkeypatch):
    # 20:00 UTC on 18 Oct is already 19 Oct in India.
    real = payments.datetime

    class FakeDatetime(real):
        @classmethod
        def now(cls, tz=None):
            return real(2026, 10, 18, 20, 0, tzinfo=payments.timezone.utc).astimezone(tz)

    monkeypatch.setattr(payments, "datetime", FakeDatetime)
    assert payments._today_ist() == date(2026, 10, 19)
