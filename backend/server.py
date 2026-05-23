from fastapi import FastAPI, APIRouter, Request
from fastapi.responses import JSONResponse
from payments import payments_router
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env", override=True)

# ---------------------------------------------------------------------------
# Startup diagnostics (never prints secret values)
# ---------------------------------------------------------------------------
print("=== TrailVista Backend Starting ===")
print(f"  Python started: OK")
print(f"  PORT: {os.environ.get('PORT', '(not set, default 8000)')}")
print(f"  CWD: {os.getcwd()}")
print(f"  HAS SUPABASE_URL: {bool(os.getenv('SUPABASE_URL'))}")
print(f"  HAS SUPABASE_SERVICE_ROLE_KEY: {bool(os.getenv('SUPABASE_SERVICE_ROLE_KEY'))}")
print(f"  HAS RAZORPAY_KEY_ID: {bool(os.getenv('RAZORPAY_KEY_ID'))}")
print(f"  HAS RAZORPAY_KEY_SECRET: {bool(os.getenv('RAZORPAY_KEY_SECRET'))}")
print(f"  HAS CORS_ORIGINS: {bool(os.getenv('CORS_ORIGINS'))}")
print(f"  HAS SMTP_HOST: {bool(os.getenv('SMTP_HOST'))}")
print(f"  HAS SMTP_PORT: {bool(os.getenv('SMTP_PORT'))}")
print(f"  HAS SMTP_USER: {bool(os.getenv('SMTP_USER'))}")
print(f"  HAS SMTP_PASS: {bool(os.getenv('SMTP_PASS'))}")
print(f"  HAS SMTP_FROM_EMAIL: {bool(os.getenv('SMTP_FROM_EMAIL'))}")
print(f"  HAS SMTP_FROM_NAME: {bool(os.getenv('SMTP_FROM_NAME'))}")
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
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_router = APIRouter(prefix="/api")


@app.get("/health")
async def health_check():
    return {"status": "ok"}


@api_router.get("/")
async def root():
    return {"message": "Hello World"}


api_router.include_router(payments_router)
app.include_router(api_router)


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled error on %s %s: %s", request.method, request.url.path, exc)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error."},
    )
