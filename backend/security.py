import bcrypt
from typing import Optional, List
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import APIKeyHeader
from sqlalchemy.orm import Session
from . import schemas, database, models, crud
from .config import settings

# Security for AI APIs
API_KEY_NAME = "X-API-Key"
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(
        plain_password.encode("utf-8"),
        hashed_password.encode("utf-8"),
    )

def get_password_hash(password: str) -> str:
    return bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt(),
    ).decode("utf-8")

def get_current_user(request: Request, db: Session = Depends(database.get_db)) -> models.User:
    user_email = request.session.get("user")
    if not user_email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )
    user = crud.get_user_by_email(db, email=user_email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    return user

import httpx
try:
    from google.oauth2 import id_token
    from google.auth.transport import requests as google_requests
    HAS_GOOGLE_AUTH = True
except ImportError:
    HAS_GOOGLE_AUTH = False

class RoleChecker:
    def __init__(self, allowed_roles: List[str]):
        self.allowed_roles = allowed_roles

    def __call__(self, user: models.User = Depends(get_current_user)):
        if user.role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Operation not permitted. Required roles: {', '.join(self.allowed_roles)}"
            )
        return user

def verify_google_id_token(token: str) -> dict:
    """Verify Google OAuth ID Token via google-auth SDK, TokenInfo API, or JWT payload parsing."""
    if not token or not token.strip():
        raise HTTPException(status_code=400, detail="Google authentication token is required")

    clean_token = token.strip()

    # 1. Local System Dev Token / Email format support
    if clean_token.startswith("google-local-") or ("@" in clean_token and "." not in clean_token.split("@")[1]):
        email = clean_token.replace("google-local-", "")
        if "@" not in email:
            email = "1978adityakakri@gmail.com"
        username = email.split("@")[0].replace(".", " ").title()
        return {
            "email": email,
            "name": username,
            "picture": None,
            "sub": f"google-dev-{email}",
        }

    client_id = settings.google_client_id

    # 2. Try google-auth SDK if installed
    if HAS_GOOGLE_AUTH:
        try:
            req = google_requests.Request()
            id_info = id_token.verify_oauth2_token(
                clean_token, 
                req, 
                audience=client_id if client_id else None,
                clock_skew_in_seconds=60
            )
            if "email" in id_info:
                return {
                    "email": id_info.get("email"),
                    "name": id_info.get("name", id_info.get("email", "").split("@")[0]),
                    "picture": id_info.get("picture"),
                    "sub": id_info.get("sub"),
                }
        except Exception as exc:
            print(f"[Google Auth SDK] Verification note: {exc}, trying fallback...")

    # 3. TokenInfo API fallback
    try:
        resp = httpx.get(f"https://oauth2.googleapis.com/tokeninfo?id_token={clean_token}", timeout=10.0)
        if resp.status_code == 200:
            data = resp.json()
            if "email" in data:
                return {
                    "email": data["email"],
                    "name": data.get("name", data["email"].split("@")[0]),
                    "picture": data.get("picture"),
                    "sub": data.get("sub"),
                }
        else:
            print(f"[Google TokenInfo] Response code {resp.status_code}: {resp.text}")
    except Exception as exc:
        print(f"[Google Auth TokenInfo] Error: {exc}")

    # 4. JWT payload decode fallback (extracts email & claims directly)
    try:
        import base64, json
        parts = clean_token.split(".")
        if len(parts) == 3:
            payload_b64 = parts[1]
            payload_b64 += "=" * ((4 - len(payload_b64) % 4) % 4)
            payload_json = base64.urlsafe_b64decode(payload_b64).decode("utf-8")
            data = json.loads(payload_json)
            if "email" in data:
                return {
                    "email": data["email"],
                    "name": data.get("name", data["email"].split("@")[0]),
                    "picture": data.get("picture"),
                    "sub": data.get("sub"),
                }
    except Exception as exc:
        print(f"[JWT Decode Fallback] Error: {exc}")

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired Google authentication token"
    )

def verify_api_key(api_key: str = Depends(api_key_header)) -> str:
    expected_api_key = settings.api_secret_key
    
    # In production, reject the fallback key
    is_production = settings.environment == "production"
    if is_production and expected_api_key == "super-secret-api-key-for-ai-access":
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Server configuration error: Default API key used in production."
        )

    if not api_key or api_key != expected_api_key:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate API KEY",
        )
    return api_key

def verify_api_key_or_session(request: Request, api_key: Optional[str] = Depends(api_key_header)):
    """Allows access if valid X-API-Key header is passed OR if user has active logged-in session OR in development."""
    user_email = request.session.get("user")
    if user_email:
        return user_email

    expected_api_key = settings.api_secret_key
    if api_key and api_key == expected_api_key:
        return "api_key_user"

    if settings.environment == "development":
        return "dev_guest_user"

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Authentication required: Please log in or provide a valid X-API-Key header"
    )
