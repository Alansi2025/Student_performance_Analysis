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
