import logging
import os
import threading
import time
from collections import defaultdict, deque
from typing import Literal, Optional

import requests
from fastapi import APIRouter, BackgroundTasks, HTTPException, Request
from pydantic import BaseModel, EmailStr, Field

from email_service import send_enquiry_notification

logger = logging.getLogger(__name__)

enquiries_router = APIRouter(prefix="/enquiries", tags=["enquiries"])

# Best-effort abuse limits for a public, unauthenticated form.
PER_CLIENT_LIMIT = 5
PER_CLIENT_WINDOW_SECONDS = 15 * 60
GLOBAL_LIMIT = 200
GLOBAL_WINDOW_SECONDS = 60 * 60

_rate_lock = threading.Lock()
_client_hits: dict[str, deque] = defaultdict(deque)
_global_hits: deque = deque()


class EnquiryRequest(BaseModel):
    source: Literal["contact", "trek"]
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    phone: str = Field(..., min_length=7, max_length=20, pattern=r"^[0-9+\-() ]+$")
    subject: Optional[Literal["general", "booking", "custom", "corporate", "feedback"]] = None
    trek_name: Optional[str] = Field(None, max_length=120)
    travel_month: Optional[str] = Field(None, max_length=40)
    group_size: Optional[int] = Field(None, ge=1, le=50)
    message: Optional[str] = Field(None, max_length=2000)
    # Honeypot: hidden from people, filled in by naive bots.
    website: Optional[str] = Field(None, max_length=200)


def _client_key(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for", "")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def _prune(hits: deque, now: float, window: int) -> None:
    while hits and now - hits[0] > window:
        hits.popleft()


def _check_rate_limit(key: str) -> None:
    now = time.monotonic()
    with _rate_lock:
        client_hits = _client_hits[key]
        _prune(client_hits, now, PER_CLIENT_WINDOW_SECONDS)
        _prune(_global_hits, now, GLOBAL_WINDOW_SECONDS)
        if len(client_hits) >= PER_CLIENT_LIMIT or len(_global_hits) >= GLOBAL_LIMIT:
            raise HTTPException(status_code=429, detail="Too many enquiries. Please try again later.")
        client_hits.append(now)
        _global_hits.append(now)


def reset_rate_limits() -> None:
    """Test helper."""
    with _rate_lock:
        _client_hits.clear()
        _global_hits.clear()


def _clean(value: Optional[str]) -> Optional[str]:
    if value is None:
        return None
    value = value.strip()
    return value or None


def _insert_enquiry(row: dict) -> None:
    supabase_url = os.environ.get("SUPABASE_URL", "").rstrip("/")
    service_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "").strip()
    if not supabase_url or not service_key:
        logger.error("Enquiry not saved: Supabase credentials missing")
        raise HTTPException(status_code=500, detail="Enquiries are temporarily unavailable.")

    try:
        response = requests.post(
            f"{supabase_url}/rest/v1/enquiries",
            headers={
                "apikey": service_key,
                "Authorization": f"Bearer {service_key}",
                "Content-Type": "application/json",
                "Prefer": "return=minimal",
            },
            json=row,
            timeout=10,
        )
    except requests.RequestException as exc:
        logger.error("Enquiry insert network error: %s", exc)
        raise HTTPException(status_code=502, detail="Could not send your enquiry. Please try again.") from exc

    if response.status_code >= 400:
        logger.error("Enquiry insert failed: status=%s body=%s", response.status_code, response.text[:300])
        raise HTTPException(status_code=502, detail="Could not send your enquiry. Please try again.")


@enquiries_router.post("", status_code=201)
def create_enquiry(body: EnquiryRequest, request: Request, background_tasks: BackgroundTasks):
    if body.website:
        # Pretend success so bots don't learn about the honeypot.
        logger.info("Enquiry dropped by honeypot")
        return {"success": True}

    _check_rate_limit(_client_key(request))

    row = {
        "source": body.source,
        "name": body.name.strip(),
        "email": str(body.email).lower(),
        "phone": body.phone.strip(),
        "subject": body.subject,
        "trek_name": _clean(body.trek_name),
        "travel_month": _clean(body.travel_month),
        "group_size": body.group_size,
        "message": _clean(body.message),
    }
    _insert_enquiry(row)
    logger.info("Enquiry saved: source=%s", body.source)

    notify_to = os.environ.get("ENQUIRY_NOTIFY_EMAIL", "").strip()
    if notify_to:
        background_tasks.add_task(send_enquiry_notification, notify_to, row)

    return {"success": True}
