import os
import bcrypt
from typing import Optional
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import APIKeyHeader
from sqlalchemy.orm import Session
from . import schemas, database, models

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

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_current_user(request: Request, db: Session = Depends(database.get_db)):
    user_email = request.session.get("user")
    if not user_email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )
    user = get_user_by_email(db, email=user_email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    return user

def verify_api_key(api_key: str = Depends(api_key_header)):
    expected_api_key = os.getenv("API_SECRET_KEY", "super-secret-api-key-for-ai-access")
    
    # In production, reject the fallback key
    is_production = os.getenv("ENVIRONMENT") == "production"
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

def log_activity(db: Session, action: str, details: str = None, user_email: str = None, ip_address: str = None):
    new_log = models.ActivityLog(
        user_email=user_email,
        action=action,
        details=details,
        ip_address=ip_address
    )
    db.add(new_log)
    db.commit()
