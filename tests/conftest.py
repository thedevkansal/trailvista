"""Shared fixtures for payment tests: mocked Razorpay client and Supabase PostgREST.

Run: pip install -r backend/requirements.txt -r backend/requirements-dev.txt && pytest tests/
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
WEBHOOK_SECRET = "test_webhook_secret"
USER_ID = "11111111-1111-1111-1111-111111111111"
OTHER_USER_ID = "22222222-2222-2222-2222-222222222222"
USER_EMAIL = "owner@example.com"
CHEAP_TREK = "kedarkantha-trek"
EXPENSIVE_TREK = "stok-kangri-expedition"
ORDER_ID = "order_test123"
PAYMENT_ID = "pay_test123"


def sign(order_id: str = ORDER_ID, payment_id: str = PAYMENT_ID) -> str:
    return hmac.new(
        KEY_SECRET.encode(), f"{order_id}|{payment_id}".encode(), hashlib.sha256
    ).hexdigest()


def make_order(trek_id=CHEAP_TREK, user_id=USER_ID, amount=None, currency="INR", **notes):
    return {
        "id": ORDER_ID,
        "amount": int(TREK_PRICES[trek_id] * 100) if amount is None else amount,
        "currency": currency,
        "notes": {"trek_id": trek_id, "user_id": user_id, **notes},
    }


class FakeResponse:
    def __init__(self, status_code, payload):
        self.status_code = status_code
        self._payload = payload
        self.text = str(payload)

    def json(self):
        return self._payload


class FakeRazorpay:
    def __init__(self, order=None):
        self.created_orders = []
        self.fetched_orders = []
        self._order = order
        parent = self

        class Orders:
            def create(self, data):
                parent.created_orders.append(data)
                return {"id": ORDER_ID, **data}

            def fetch(self, order_id):
                parent.fetched_orders.append(order_id)
                assert order_id == ORDER_ID
                return parent._order

        class Payments:
            def fetch(self, payment_id):
                return {"email": "razorpay-fallback@example.com", "notes": {}}

        self.order = Orders()
        self.payment = Payments()


class FakeSupabase:
    """Stands in for requests.get/post against the bookings PostgREST endpoint.

    Enforces the unique razorpay_payment_id constraint like the real table."""

    def __init__(self, existing=None):
        self.rows = [existing] if existing else []
        self.inserted = []

    def get(self, url, params=None, headers=None, timeout=None):
        assert url.endswith("/rest/v1/bookings")
        payment_id = params["razorpay_payment_id"].removeprefix("eq.")
        return FakeResponse(200, [r for r in self.rows if r["razorpay_payment_id"] == payment_id][:1])

    def post(self, url, headers=None, json=None, timeout=None):
        assert url.endswith("/rest/v1/bookings")
        if any(r["razorpay_payment_id"] == json["razorpay_payment_id"] for r in self.rows):
            return FakeResponse(409, {"code": "23505", "message": "duplicate key"})
        row = {"id": f"booking-{len(self.rows) + 1}", "created_at": "2026-10-19T00:00:00Z", **json}
        self.rows.append(row)
        self.inserted.append(json)
        return FakeResponse(201, [row])


class Harness:
    def __init__(self, monkeypatch):
        self._monkeypatch = monkeypatch
        self.sent_emails = []
        self.razorpay = FakeRazorpay()
        self.supabase = FakeSupabase()

        monkeypatch.setenv("RAZORPAY_KEY_ID", "rzp_test_key")
        monkeypatch.setenv("RAZORPAY_KEY_SECRET", KEY_SECRET)
        monkeypatch.setenv("RAZORPAY_WEBHOOK_SECRET", WEBHOOK_SECRET)
        monkeypatch.setenv("SUPABASE_URL", "https://example.supabase.co")
        monkeypatch.setenv("SUPABASE_SERVICE_ROLE_KEY", "service_role_test")
        monkeypatch.setattr(
            payments,
            "send_booking_confirmation_email",
            lambda to, details: self.sent_emails.append((to, details)) or True,
        )
        monkeypatch.setattr(payments, "get_razorpay_client", lambda: self.razorpay)
        monkeypatch.setattr(payments.requests, "get", lambda *a, **kw: self.supabase.get(*a, **kw))
        monkeypatch.setattr(payments.requests, "post", lambda *a, **kw: self.supabase.post(*a, **kw))

        app = FastAPI()
        app.include_router(payments.payments_router)
        app.dependency_overrides[payments.get_current_user] = lambda: {
            "id": USER_ID,
            "email": USER_EMAIL,
            "user_metadata": {"full_name": "Owner"},
        }
        self.client = TestClient(app)

    def configure(self, order=None, existing=None):
        self.razorpay._order = order
        self.supabase = FakeSupabase(existing=existing)
        return self.supabase

    @property
    def email_recipients(self):
        return [to for to, _ in self.sent_emails]


@pytest.fixture
def harness(monkeypatch):
    return Harness(monkeypatch)
