import os
import logging
from pathlib import Path
from dotenv import load_dotenv

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env", override=True)

import requests
from fastapi import FastAPI, APIRouter, Request
from fastapi.responses import JSONResponse
from payments import payments_router
from starlette.middleware.cors import CORSMiddleware

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
print(f"  HAS RESEND_API_KEY: {bool(os.getenv('RESEND_API_KEY'))}")
print(f"  HAS EMAIL_FROM: {bool(os.getenv('EMAIL_FROM'))}")
print(f"  HAS BREVO_API_KEY: {bool(os.getenv('BREVO_API_KEY'))}")
print(f"  HAS EMAIL_FROM_NAME: {bool(os.getenv('EMAIL_FROM_NAME'))}")
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


@api_router.get("/auth/check-user")
async def check_user(email: str):
    email_clean = email.strip().lower()
    supabase_url = os.environ.get("SUPABASE_URL", "").rstrip("/")
    service_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "").strip()
    
    if not supabase_url or not service_key:
        return JSONResponse(
            status_code=500,
            content={"detail": "Supabase credentials not configured on backend."}
        )
        
    headers = {
        "Authorization": f"Bearer {service_key}",
        "apikey": service_key,
        "Accept": "application/json",
    }
    
    page = 1
    per_page = 50
    exists = False
    
    while True:
        try:
            response = requests.get(
                f"{supabase_url}/auth/v1/admin/users",
                headers=headers,
                params={"page": page, "per_page": per_page},
                timeout=10
            )
            if response.status_code != 200:
                logger.error("Supabase user search failed with status %s: %s", response.status_code, response.text)
                break
            
            data = response.json()
            users = data.get("users", []) if isinstance(data, dict) else data
            if not users:
                break
                
            for u in users:
                u_email = u.get("email")
                if u_email and u_email.strip().lower() == email_clean:
                    exists = True
                    break
            
            if exists or len(users) < per_page:
                break
                
            page += 1
        except Exception as exc:
            logger.error("Exception occurred during user lookup: %s", exc)
            break
            
    return {"exists": exists}


api_router.include_router(payments_router)
app.include_router(api_router)


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled error on %s %s: %s", request.method, request.url.path, exc)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error."},
    )
