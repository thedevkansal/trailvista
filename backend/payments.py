import hashlib
import hmac
import logging
import os
from typing import Any, Optional

import razorpay
import requests
from fastapi import APIRouter, Depends, Header, HTTPException
from pydantic import BaseModel, Field

from email_service import send_booking_confirmation_email
from trek_prices import TREK_NAMES, TREK_PRICES

logger = logging.getLogger(__name__)

payments_router = APIRouter(prefix="/payments", tags=["payments"])

_razorpay_client: Optional[razorpay.Client] = None

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


async def get_current_user(authorization: Optional[str] = Header(None)) -> dict[str, Any]:
    if not authorization or not authorization.startswith("Bearer "):
        logger.warning("Payment auth: missing or invalid Authorization header")
        raise HTTPException(status_code=401, detail="Authentication required.")

    token = authorization[7:].strip()
    if not token:
        raise HTTPException(status_code=401, detail="Authentication required.")

    return _verify_supabase_jwt(token)


async def get_current_user_id(authorization: Optional[str] = Header(None)) -> str:
    user = await get_current_user(authorization)
    return user["id"]


class CreateOrderRequest(BaseModel):
    trek_id: str = Field(..., min_length=1)
    currency: str = "INR"


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


def _booking_email_details(
    booking: dict[str, Any],
    trek_id: str,
    user_email: Optional[str],
    customer_name: Optional[str],
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
    }


def _send_confirmation_email_safe(
    booking: dict[str, Any],
    trek_id: str,
    user_email: Optional[str],
    customer_name: Optional[str],
) -> bool:
    if not user_email:
        logger.info("booking confirmation email skipped: no user_email")
        return False
    details = _booking_email_details(booking, trek_id, user_email, customer_name)
    email_sent = send_booking_confirmation_email(user_email, details)
    if email_sent:
        logger.info("booking confirmation email_sent=true to=%s", user_email)
    else:
        logger.warning("booking confirmation email_sent=false to=%s", user_email)
    return email_sent


def _verify_success_response(
    booking: dict[str, Any],
    message: str,
    trek_id: str,
    user_email: Optional[str],
    customer_name: Optional[str],
) -> dict[str, Any]:
    email_sent = _send_confirmation_email_safe(booking, trek_id, user_email, customer_name)
    return {
        "success": True,
        "booking": booking,
        "message": message,
        "email_sent": email_sent,
        "email_to": user_email if email_sent else None,
    }


def verify_razorpay_signature(order_id: str, payment_id: str, signature: str, secret: str) -> bool:
    payload = f"{order_id}|{payment_id}"
    expected = hmac.new(secret.encode("utf-8"), payload.encode("utf-8"), hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature)


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


def _insert_booking(booking_row: dict[str, Any]) -> dict[str, Any]:
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
            return rows[0]
        _log_supabase_error("booking_insert_empty_body", response)
        raise HTTPException(
            status_code=500,
            detail="Payment verified but booking could not be saved.",
        )

    if response.status_code == 409:
        logger.info("booking_insert_conflict payment_id=%s", booking_row.get("razorpay_payment_id"))
        existing = _find_booking_by_payment_id(booking_row["razorpay_payment_id"])
        if existing:
            return existing

    _log_supabase_error("booking_insert", response)
    if response.status_code == 403 and "42501" in response.text:
        logger.error(
            "Run supabase/migrations/002_bookings_service_role_grants.sql in Supabase SQL Editor"
        )
    raise HTTPException(
        status_code=500,
        detail="Payment verified but booking could not be saved.",
    )


@payments_router.post("/create-order", response_model=CreateOrderResponse)
async def create_order(body: CreateOrderRequest, user_id: str = Depends(get_current_user_id)):
    logger.info("create-order request received: trek_id=%s user_id=%s", body.trek_id, user_id)

    if _missing_env():
        raise HTTPException(status_code=500, detail="Payment server is not configured.")

    if body.trek_id not in TREK_PRICES:
        raise HTTPException(status_code=400, detail="Invalid trek.")

    amount_inr = TREK_PRICES[body.trek_id]
    amount_paise = int(amount_inr * 100)
    currency = (body.currency or "INR").upper()

    key_id = os.environ.get("RAZORPAY_KEY_ID")
    client = get_razorpay_client()
    receipt = f"trek_{body.trek_id}_{user_id[:8]}"

    try:
        order = client.order.create(
            {
                "amount": amount_paise,
                "currency": currency,
                "receipt": receipt,
                "notes": {"trek_id": body.trek_id, "user_id": user_id},
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
async def verify_payment(
    body: VerifyPaymentRequest,
    user: dict[str, Any] = Depends(get_current_user)
):
    user_id = user["id"]
    jwt_email = user.get("email")
    jwt_name = user.get("user_metadata", {}).get("full_name")

    user_email = body.user_email or jwt_email
    customer_name = body.customer_name or jwt_name

    logger.info(
        "verify request received: service_role_present=%s trek_id=%s payment_id=%s user_id=%s user_email=%s",
        bool(os.environ.get("SUPABASE_SERVICE_ROLE_KEY")),
        body.trek_id,
        body.razorpay_payment_id,
        user_id,
        user_email,
    )

    if _missing_env():
        raise HTTPException(status_code=500, detail="Payment server is not configured.")

    if body.trek_id not in TREK_PRICES:
        raise HTTPException(status_code=400, detail="Invalid trek.")

    amount_inr = TREK_PRICES[body.trek_id]
    if body.amount is not None and float(body.amount) != float(amount_inr):
        raise HTTPException(status_code=400, detail="Invalid payment amount.")

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

    existing = _find_booking_by_payment_id(body.razorpay_payment_id)
    if existing:
        return _verify_success_response(
            existing,
            "Booking already confirmed.",
            body.trek_id,
            user_email,
            customer_name,
        )

    booking_row = {
        "user_id": user_id,
        "trek_id": body.trek_id,
        "amount": amount_inr,
        "currency": "INR",
        "razorpay_order_id": body.razorpay_order_id,
        "razorpay_payment_id": body.razorpay_payment_id,
        "payment_status": "paid",
        "booking_status": "confirmed",
    }

    booking = _insert_booking(booking_row)
    return _verify_success_response(
        booking,
        "Booking confirmed successfully.",
        body.trek_id,
        user_email,
        customer_name,
    )
