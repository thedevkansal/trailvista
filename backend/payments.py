import hashlib
import hmac
import json
import logging
import os
from datetime import date, datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Optional

from dotenv import load_dotenv

# Ensure environment variables are loaded immediately on import
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env", override=True)

import razorpay
import requests
from fastapi import APIRouter, Depends, Header, HTTPException, BackgroundTasks, Request
from fastapi.concurrency import run_in_threadpool
from pydantic import BaseModel, Field

from email_service import send_booking_confirmation_email
from trek_prices import TREK_NAMES, TREK_PRICES

logger = logging.getLogger(__name__)

payments_router = APIRouter(prefix="/payments", tags=["payments"])

_razorpay_client: Optional[razorpay.Client] = None

BOOKING_CURRENCY = "INR"

REQUIRED_ENV = (
    "RAZORPAY_KEY_ID",
    "RAZORPAY_KEY_SECRET",
    "SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
)


def _missing_env() -> list[str]:
    return [key for key in REQUIRED_ENV if not os.environ.get(key)]


def _log_env_status() -> None:
    missing = _missing_env()
    logger.info(
        "Payment env: service_role_present=%s supabase_url_present=%s razorpay_key_present=%s",
        bool(os.environ.get("SUPABASE_SERVICE_ROLE_KEY")),
        bool(os.environ.get("SUPABASE_URL")),
        bool(os.environ.get("RAZORPAY_KEY_ID")),
    )
    if missing:
        logger.error("Missing required env variables: %s", ", ".join(missing))


_log_env_status()


def _get_service_role_key() -> str:
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "").strip()
    if not key:
        logger.error("SUPABASE_SERVICE_ROLE_KEY is missing")
        raise HTTPException(status_code=500, detail="Supabase service role is not configured.")
    return key


def _supabase_db_headers() -> dict[str, str]:
    """PostgREST headers for bookings table — service role only."""
    service_key = _get_service_role_key()
    return {
        "apikey": service_key,
        "Authorization": f"Bearer {service_key}",
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Prefer": "return=representation",
    }


def _supabase_rest_url(path: str) -> str:
    base = os.environ.get("SUPABASE_URL", "").rstrip("/")
    return f"{base}/rest/v1/{path}"


def _log_supabase_error(operation: str, response: requests.Response) -> None:
    logger.error(
        "Supabase %s failed: status=%s body=%s",
        operation,
        response.status_code,
        response.text[:500],
    )


def get_razorpay_client() -> razorpay.Client:
    global _razorpay_client
    if _razorpay_client is None:
        key_id = os.environ.get("RAZORPAY_KEY_ID")
        key_secret = os.environ.get("RAZORPAY_KEY_SECRET")
        if not key_id or not key_secret:
            logger.error("RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET missing")
            raise HTTPException(status_code=500, detail="Razorpay is not configured on the server.")
        _razorpay_client = razorpay.Client(auth=(key_id, key_secret))
    return _razorpay_client


def _verify_supabase_jwt(token: str) -> dict[str, Any]:
    """Validate user JWT via Auth API (anon or service key as apikey only)."""
    supabase_url = os.environ.get("SUPABASE_URL", "").rstrip("/")
    api_key = os.environ.get("SUPABASE_ANON_KEY") or _get_service_role_key()

    try:
        response = requests.get(
            f"{supabase_url}/auth/v1/user",
            headers={
                "Authorization": f"Bearer {token}",
                "apikey": api_key,
            },
            timeout=10,
        )
    except requests.RequestException as exc:
        logger.error("Payment auth: Supabase user lookup failed: %s", exc)
        raise HTTPException(status_code=502, detail="Unable to verify session.") from exc

    if response.status_code != 200:
        logger.warning(
            "Payment auth: invalid token (status=%s, body=%s)",
            response.status_code,
            response.text[:200],
        )
        raise HTTPException(status_code=401, detail="Invalid or expired session.")

    user = response.json()
    if not user or not user.get("id"):
        raise HTTPException(status_code=401, detail="Invalid or expired session.")
    return user


def get_current_user(authorization: Optional[str] = Header(None)) -> dict[str, Any]:
    if not authorization or not authorization.startswith("Bearer "):
        logger.warning("Payment auth: missing or invalid Authorization header")
        raise HTTPException(status_code=401, detail="Authentication required.")

    token = authorization[7:].strip()
    if not token:
        raise HTTPException(status_code=401, detail="Authentication required.")

    return _verify_supabase_jwt(token)


def get_current_user_id(user: dict[str, Any] = Depends(get_current_user)) -> str:
    return user["id"]


class CreateOrderRequest(BaseModel):
    trek_id: str = Field(..., min_length=1)
    # Accepted for backwards compatibility with the frontend; ignored — orders are always INR.
    currency: Optional[str] = None
    departure_date: Optional[str] = None


class CreateOrderResponse(BaseModel):
    order_id: str
    amount: int
    currency: str
    key_id: str
    trek_id: str


class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    trek_id: str
    amount: Optional[float] = None
    user_email: Optional[str] = None
    customer_name: Optional[str] = None
    departure_date: Optional[str] = None


def _booking_email_details(
    booking: dict[str, Any],
    trek_id: str,
    user_email: Optional[str],
    customer_name: Optional[str],
    departure_date: Optional[str] = None,
) -> dict[str, Any]:
    booked_at = booking.get("created_at") or ""
    return {
        "customer_name": customer_name or "",
        "customer_email": user_email or "",
        "trek_name": TREK_NAMES.get(trek_id, trek_id),
        "trek_id": trek_id,
        "amount": booking.get("amount"),
        "currency": booking.get("currency", "INR"),
        "razorpay_order_id": booking.get("razorpay_order_id"),
        "razorpay_payment_id": booking.get("razorpay_payment_id"),
        "booking_status": booking.get("booking_status"),
        "payment_status": booking.get("payment_status"),
        "booked_at": booked_at,
        "departure_date": departure_date,
    }


def _send_confirmation_email_safe(
    booking: dict[str, Any],
    trek_id: str,
    user_email: Optional[str],
    customer_name: Optional[str],
    departure_date: Optional[str] = None,
) -> bool:
    if not user_email:
        logger.warning("Booking confirmation skipped: no recipient email found.")
        return False
    details = _booking_email_details(booking, trek_id, user_email, customer_name, departure_date)
    email_sent = send_booking_confirmation_email(user_email, details)
    if email_sent:
        logger.info("booking confirmation email_sent=true")
    else:
        logger.warning("booking confirmation email_sent=false")
    return email_sent


def verify_razorpay_signature(order_id: str, payment_id: str, signature: str, secret: str) -> bool:
    payload = f"{order_id}|{payment_id}"
    expected = hmac.new(secret.encode("utf-8"), payload.encode("utf-8"), hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature)


def _order_mismatches(
    order: dict[str, Any],
    expected_trek_id: Optional[str] = None,
    expected_user_id: Optional[str] = None,
) -> list[str]:
    """Return the fields on a Razorpay order that don't match what create_order would
    have produced. Expected trek/user are optional; the notes must carry both either way."""
    notes = order.get("notes")
    if not isinstance(notes, dict):
        notes = {}

    order_trek_id = notes.get("trek_id")
    order_user_id = notes.get("user_id")
    expected_amount = TREK_PRICES.get(order_trek_id) if order_trek_id else None

    mismatches = []
    if not order_trek_id or (expected_trek_id is not None and order_trek_id != expected_trek_id):
        mismatches.append("trek_id")
    if not order_user_id or (expected_user_id is not None and order_user_id != expected_user_id):
        mismatches.append("user_id")
    if expected_amount is None or order.get("amount") != int(expected_amount * 100):
        mismatches.append("amount")
    if order.get("currency") != BOOKING_CURRENCY:
        mismatches.append("currency")
    return mismatches


def verify_webhook_signature(raw_body: bytes, signature: str, secret: str) -> bool:
    expected = hmac.new(secret.encode("utf-8"), raw_body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature)


def _fetch_order(order_id: str) -> dict[str, Any]:
    try:
        order = get_razorpay_client().order.fetch(order_id)
    except HTTPException:
        raise
    except Exception as exc:
        logger.error("Razorpay order fetch failed for order_id=%s: %s", order_id, exc)
        raise HTTPException(status_code=502, detail="Unable to verify payment order.") from exc

    if not isinstance(order, dict):
        logger.error("Razorpay order fetch returned unexpected payload for order_id=%s", order_id)
        raise HTTPException(status_code=502, detail="Unable to verify payment order.")
    return order


def _fetch_verified_order(order_id: str, trek_id: str, user_id: str) -> dict[str, Any]:
    """Fetch the Razorpay order and confirm it was created by create_order for this
    user and trek at the server-side price. The signature only proves order/payment
    pairing, so the order itself is the source of truth for what was paid for."""
    order = _fetch_order(order_id)
    mismatches = _order_mismatches(order, trek_id, user_id)
    if mismatches:
        notes = order.get("notes") if isinstance(order.get("notes"), dict) else {}
        logger.warning(
            "Razorpay order mismatch order_id=%s fields=%s request_trek_id=%s order_trek_id=%s user_id=%s",
            order_id,
            ",".join(mismatches),
            trek_id,
            notes.get("trek_id"),
            user_id,
        )
        raise HTTPException(status_code=400, detail="Payment verification failed.")

    return order


# Treks run in India, so "today" for departure dates is the IST calendar day.
IST = timezone(timedelta(hours=5, minutes=30))


def _today_ist() -> date:
    return datetime.now(IST).date()


def _parse_departure_date(value: Optional[str]) -> Optional[str]:
    if not value:
        return None
    try:
        return date.fromisoformat(value.strip()).isoformat()
    except ValueError:
        logger.warning("Ignoring invalid departure_date=%r", value)
        return None


def _find_booking_by_payment_id(payment_id: str) -> Optional[dict[str, Any]]:
    logger.info("booking_lookup_started payment_id=%s", payment_id)
    try:
        response = requests.get(
            _supabase_rest_url("bookings"),
            params={
                "razorpay_payment_id": f"eq.{payment_id}",
                "select": "*",
                "limit": "1",
            },
            headers=_supabase_db_headers(),
            timeout=15,
        )
    except requests.RequestException as exc:
        logger.error("booking_lookup network error: %s", exc)
        raise HTTPException(
            status_code=500,
            detail="Payment verified but booking could not be saved.",
        ) from exc

    if response.status_code >= 400:
        _log_supabase_error("booking_lookup", response)
        if response.status_code == 403 and "42501" in response.text:
            logger.error(
                "Run supabase/migrations/002_bookings_service_role_grants.sql in Supabase SQL Editor"
            )
        raise HTTPException(
            status_code=500,
            detail="Payment verified but booking could not be saved.",
        )

    rows = response.json()
    if isinstance(rows, list) and rows:
        logger.info("booking_lookup_found payment_id=%s", payment_id)
        return rows[0]
    logger.info("booking_lookup_empty payment_id=%s", payment_id)
    return None


def _insert_booking(booking_row: dict[str, Any]) -> tuple[dict[str, Any], bool]:
    """Insert a booking. Returns (row, created); created is False when the unique
    razorpay_payment_id constraint hit and the existing row was returned instead."""
    logger.info(
        "booking_insert_started payment_id=%s user_id=%s trek_id=%s",
        booking_row.get("razorpay_payment_id"),
        booking_row.get("user_id"),
        booking_row.get("trek_id"),
    )
    try:
        response = requests.post(
            _supabase_rest_url("bookings"),
            headers=_supabase_db_headers(),
            json=booking_row,
            timeout=15,
        )
    except requests.RequestException as exc:
        logger.error("booking_insert network error: %s", exc)
        raise HTTPException(
            status_code=500,
            detail="Payment verified but booking could not be saved.",
        ) from exc

    if response.status_code in (200, 201):
        rows = response.json()
        if isinstance(rows, list) and rows:
            logger.info(
                "booking_insert_success payment_id=%s booking_id=%s",
                booking_row.get("razorpay_payment_id"),
                rows[0].get("id"),
            )
            return rows[0], True
        _log_supabase_error("booking_insert_empty_body", response)
        raise HTTPException(
            status_code=500,
            detail="Payment verified but booking could not be saved.",
        )

    if response.status_code == 409:
        logger.info("booking_insert_conflict payment_id=%s", booking_row.get("razorpay_payment_id"))
        existing = _find_booking_by_payment_id(booking_row["razorpay_payment_id"])
        if existing:
            return existing, False

    _log_supabase_error("booking_insert", response)
    if response.status_code == 403 and "42501" in response.text:
        logger.error(
            "Run supabase/migrations/002_bookings_service_role_grants.sql in Supabase SQL Editor"
        )
    raise HTTPException(
        status_code=500,
        detail="Payment verified but booking could not be saved.",
    )


class BookingOwnershipConflict(HTTPException):
    def __init__(self) -> None:
        super().__init__(status_code=409, detail="This payment is already linked to another booking.")


def _record_booking(
    *,
    user_id: str,
    trek_id: str,
    order_id: str,
    payment_id: str,
    departure_date: Optional[str],
) -> tuple[dict[str, Any], bool]:
    """Single insert path shared by /verify and the webhook. Idempotent on
    razorpay_payment_id: returns (booking, created) and never creates a duplicate.
    Raises 409 if the payment is already booked under a different user."""
    existing = _find_booking_by_payment_id(payment_id)
    if existing:
        booking, created = existing, False
    else:
        booking_row = {
            "user_id": user_id,
            "trek_id": trek_id,
            "amount": TREK_PRICES[trek_id],
            "currency": BOOKING_CURRENCY,
            "razorpay_order_id": order_id,
            "razorpay_payment_id": payment_id,
            "payment_status": "paid",
            "booking_status": "confirmed",
        }
        if departure_date:
            booking_row["departure_date"] = departure_date
        booking, created = _insert_booking(booking_row)

    if booking.get("user_id") != user_id:
        logger.warning(
            "booking for payment_id=%s belongs to another user (requester=%s)",
            payment_id,
            user_id,
        )
        raise BookingOwnershipConflict()
    return booking, created


@payments_router.post("/create-order", response_model=CreateOrderResponse)
def create_order(body: CreateOrderRequest, user_id: str = Depends(get_current_user_id)):
    logger.info("create-order request received: trek_id=%s user_id=%s", body.trek_id, user_id)

    if _missing_env():
        raise HTTPException(status_code=500, detail="Payment server is not configured.")

    if body.trek_id not in TREK_PRICES:
        raise HTTPException(status_code=400, detail="Invalid trek.")

    departure_date = _parse_departure_date(body.departure_date)
    if body.departure_date and body.departure_date.strip() and not departure_date:
        raise HTTPException(status_code=400, detail="Invalid departure date.")
    if departure_date and date.fromisoformat(departure_date) < _today_ist():
        raise HTTPException(status_code=400, detail="This departure date has already passed.")

    amount_inr = TREK_PRICES[body.trek_id]
    amount_paise = int(amount_inr * 100)
    currency = BOOKING_CURRENCY
    notes = {"trek_id": body.trek_id, "user_id": user_id}
    if departure_date:
        notes["departure_date"] = departure_date

    key_id = os.environ.get("RAZORPAY_KEY_ID")
    client = get_razorpay_client()
    receipt = f"trek_{body.trek_id}_{user_id[:8]}"

    try:
        order = client.order.create(
            {
                "amount": amount_paise,
                "currency": currency,
                "receipt": receipt,
                "notes": notes,
            }
        )
    except Exception as exc:
        logger.error("Razorpay order creation failed: %s", exc)
        raise HTTPException(status_code=502, detail="Failed to create payment order.") from exc

    logger.info("create-order success: order_id=%s trek_id=%s", order["id"], body.trek_id)
    return CreateOrderResponse(
        order_id=order["id"],
        amount=order["amount"],
        currency=order["currency"],
        key_id=key_id,
        trek_id=body.trek_id,
    )


@payments_router.post("/verify")
def verify_payment(
    body: VerifyPaymentRequest,
    background_tasks: BackgroundTasks,
    user: dict[str, Any] = Depends(get_current_user)
):
    user_id = user["id"]
    jwt_email = user.get("email")
    jwt_name = (user.get("user_metadata") or {}).get("full_name")

    # Confirmation goes only to the authenticated account's email, never a client-supplied address.
    recipient_email = jwt_email
    resolved_customer_name = body.customer_name or jwt_name

    logger.info(
        "verify request received: service_role_present=%s trek_id=%s payment_id=%s user_id=%s email_present=%s",
        bool(os.environ.get("SUPABASE_SERVICE_ROLE_KEY")),
        body.trek_id,
        body.razorpay_payment_id,
        user_id,
        bool(recipient_email),
    )

    if _missing_env():
        raise HTTPException(status_code=500, detail="Payment server is not configured.")

    if body.trek_id not in TREK_PRICES:
        raise HTTPException(status_code=400, detail="Invalid trek.")

    key_secret = os.environ.get("RAZORPAY_KEY_SECRET")
    if not verify_razorpay_signature(
        body.razorpay_order_id,
        body.razorpay_payment_id,
        body.razorpay_signature,
        key_secret,
    ):
        logger.warning("Razorpay signature invalid for payment_id=%s", body.razorpay_payment_id)
        raise HTTPException(status_code=400, detail="Payment verification failed.")

    logger.info("Razorpay signature valid for payment_id=%s", body.razorpay_payment_id)

    order = _fetch_verified_order(body.razorpay_order_id, body.trek_id, user_id)
    trek_id = order["notes"]["trek_id"]
    if body.amount is not None and float(body.amount) != float(TREK_PRICES[trek_id]):
        raise HTTPException(status_code=400, detail="Invalid payment amount.")

    # Date stored on the order at create time wins; body value covers older clients.
    departure_date = _parse_departure_date(order["notes"].get("departure_date")) or _parse_departure_date(
        body.departure_date
    )

    booking, created = _record_booking(
        user_id=user_id,
        trek_id=trek_id,
        order_id=body.razorpay_order_id,
        payment_id=body.razorpay_payment_id,
        departure_date=departure_date,
    )
    if not created:
        # Already recorded (earlier verify call or the webhook), which sent the email.
        return {
            "success": True,
            "booking": booking,
            "message": "Booking already confirmed.",
            "email_sent": False,
            "email_to": None,
        }

    # Fall back to the email on the Razorpay payment record if the account has none
    if not recipient_email and body.razorpay_payment_id:
        try:
            client = get_razorpay_client()
            payment_info = client.payment.fetch(body.razorpay_payment_id)
            if payment_info and isinstance(payment_info, dict):
                recipient_email = payment_info.get("email")
                if not resolved_customer_name:
                    resolved_customer_name = (payment_info.get("notes") or {}).get("name") or (payment_info.get("email") or "").split("@")[0]
                logger.info("Resolved email from Razorpay payment record: email_present=%s", bool(recipient_email))
        except Exception as exc:
            logger.warning("Failed to fetch payment details from Razorpay: %s", exc)

    if not recipient_email:
        logger.warning("Booking confirmation skipped: no recipient email found.")

    if recipient_email:
        background_tasks.add_task(
            _send_confirmation_email_safe,
            booking,
            trek_id,
            recipient_email,
            resolved_customer_name,
            departure_date,
        )
    return {
        "success": True,
        "booking": booking,
        "message": "Booking confirmed successfully.",
        "email_sent": bool(recipient_email),
        "email_to": recipient_email,
    }


WEBHOOK_BOOKING_EVENTS = ("payment.captured", "order.paid")


def _account_contact(user_id: str) -> tuple[Optional[str], Optional[str]]:
    """Look up the account's email and name via the Supabase Auth admin API."""
    service_key = _get_service_role_key()
    supabase_url = os.environ.get("SUPABASE_URL", "").rstrip("/")
    try:
        response = requests.get(
            f"{supabase_url}/auth/v1/admin/users/{user_id}",
            headers={"apikey": service_key, "Authorization": f"Bearer {service_key}"},
            timeout=10,
        )
    except requests.RequestException as exc:
        logger.warning("webhook: account lookup failed for user_id=%s: %s", user_id, exc)
        return None, None
    if response.status_code != 200:
        logger.warning("webhook: account lookup status=%s for user_id=%s", response.status_code, user_id)
        return None, None
    account = response.json() or {}
    return account.get("email"), (account.get("user_metadata") or {}).get("full_name")


def _webhook_entity(payload: dict[str, Any], name: str) -> dict[str, Any]:
    entity = (payload.get(name) or {}).get("entity")
    return entity if isinstance(entity, dict) else {}


def _handle_webhook(
    raw_body: bytes,
    signature: Optional[str],
    background_tasks: BackgroundTasks,
) -> dict[str, Any]:
    secret = os.environ.get("RAZORPAY_WEBHOOK_SECRET", "").strip()
    if not secret or _missing_env():
        logger.error("webhook: RAZORPAY_WEBHOOK_SECRET or payment env missing")
        raise HTTPException(status_code=500, detail="Webhook is not configured.")

    if not signature or not verify_webhook_signature(raw_body, signature, secret):
        logger.warning("webhook: invalid signature")
        raise HTTPException(status_code=400, detail="Invalid webhook signature.")

    try:
        event = json.loads(raw_body)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="Invalid webhook payload.") from exc

    event_type = event.get("event") if isinstance(event, dict) else None
    if event_type not in WEBHOOK_BOOKING_EVENTS:
        logger.info("webhook: ignoring event=%s", event_type)
        return {"status": "ignored"}

    payload = event.get("payload") or {}
    payment = _webhook_entity(payload, "payment")
    order = _webhook_entity(payload, "order")
    payment_id = payment.get("id")
    order_id = payment.get("order_id") or order.get("id")

    # 2xx for events we can never act on, so Razorpay stops retrying them.
    if not payment_id or not order_id:
        logger.warning("webhook: event=%s missing payment/order id", event_type)
        return {"status": "ignored"}
    if payment.get("status") != "captured":
        logger.info("webhook: event=%s payment_id=%s status=%s not captured", event_type, payment_id, payment.get("status"))
        return {"status": "ignored"}

    # order.paid embeds the order; payment.captured does not, so fetch it (502 lets Razorpay retry).
    if order.get("id") != order_id:
        order = _fetch_order(order_id)

    mismatches = _order_mismatches(order)
    if payment.get("amount") != order.get("amount"):
        mismatches.append("payment_amount")
    if payment.get("currency") != BOOKING_CURRENCY:
        mismatches.append("payment_currency")
    if mismatches:
        logger.error(
            "webhook: captured payment does not match a valid booking order payment_id=%s order_id=%s fields=%s",
            payment_id,
            order_id,
            ",".join(mismatches),
        )
        return {"status": "rejected"}

    notes = order["notes"]
    trek_id = notes["trek_id"]
    user_id = notes["user_id"]

    try:
        booking, created = _record_booking(
            user_id=user_id,
            trek_id=trek_id,
            order_id=order_id,
            payment_id=payment_id,
            departure_date=_parse_departure_date(notes.get("departure_date")),
        )
    except BookingOwnershipConflict:
        logger.error("webhook: payment_id=%s already booked under another user", payment_id)
        return {"status": "conflict"}

    if created:
        recipient_email, customer_name = _account_contact(user_id)
        recipient_email = recipient_email or payment.get("email")
        if recipient_email:
            background_tasks.add_task(
                _send_confirmation_email_safe,
                booking,
                trek_id,
                recipient_email,
                customer_name,
                booking.get("departure_date"),
            )
        else:
            logger.warning("Booking confirmation skipped: no recipient email found.")

    logger.info("webhook: event=%s payment_id=%s created=%s", event_type, payment_id, created)
    return {"status": "ok", "created": created, "booking_id": booking.get("id")}


@payments_router.post("/webhook")
async def razorpay_webhook(
    request: Request,
    background_tasks: BackgroundTasks,
    x_razorpay_signature: Optional[str] = Header(None),
):
    # Signature covers the exact raw bytes, so read the body before any parsing.
    raw_body = await request.body()
    return await run_in_threadpool(_handle_webhook, raw_body, x_razorpay_signature, background_tasks)
