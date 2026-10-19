import os
import logging
from pathlib import Path
from dotenv import load_dotenv

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

from fastapi import FastAPI, APIRouter, Request
from fastapi.responses import JSONResponse
from payments import payments_router
from starlette.middleware.cors import CORSMiddleware

# ---------------------------------------------------------------------------
# Startup diagnostics (never prints secret values)
# ---------------------------------------------------------------------------
print("=== TrailVista Backend Starting ===")
for _name in (
    "SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "RAZORPAY_KEY_ID",
    "RAZORPAY_KEY_SECRET",
    "RAZORPAY_WEBHOOK_SECRET",
    "CORS_ORIGINS",
    "RESEND_API_KEY",
    "SMTP_HOST",
    "ENQUIRY_NOTIFY_EMAIL",
):
    print(f"  HAS {_name}: {bool(os.getenv(_name))}")
print("===================================")

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
)
logger = logging.getLogger(__name__)

app = FastAPI()

# ---------------------------------------------------------------------------
# CORS — use CORS_ORIGINS env var (comma-separated) with sensible defaults
# ---------------------------------------------------------------------------
_default_origins = "http://localhost:3000,http://localhost:5173"
_origins = os.environ.get("CORS_ORIGINS", _default_origins)
allowed_origins = [o.strip() for o in _origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,  # auth uses bearer tokens, not cookies
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

api_router = APIRouter(prefix="/api")


@app.get("/health")
async def health_check():
    return {"status": "ok"}


api_router.include_router(payments_router)
app.include_router(api_router)


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled error on %s %s: %s", request.method, request.url.path, exc)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error."},
    )
