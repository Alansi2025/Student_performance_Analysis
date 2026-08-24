from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from .. import schemas, models, database, security, crud
from ..security import RoleChecker

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

@router.post("/register", response_model=schemas.User, status_code=status.HTTP_201_CREATED)
def register_user(user: schemas.UserCreate, db: Session = Depends(database.get_db)) -> schemas.User:
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    if user.role == "Teacher":
        user.role = "Mentor"
    
    return crud.create_user(db, user)

from pydantic import BaseModel
from typing import Optional

class GoogleAuthRequest(BaseModel):
    token: Optional[str] = None
    credential: Optional[str] = None
    id_token: Optional[str] = None
    role: Optional[str] = "Student"

@router.post("/google-login")
def google_login(
    payload: GoogleAuthRequest,
    request: Request,
    db: Session = Depends(database.get_db)
) -> dict:
    raw_token = payload.token or payload.credential or payload.id_token
    if not raw_token:
        raise HTTPException(status_code=400, detail="Google authentication token is required")

    google_user = security.verify_google_id_token(raw_token)
    email = google_user["email"]
    name = google_user["name"]
    picture = google_user.get("picture")

    target_role = payload.role if payload.role in ["Student", "Mentor", "Teacher", "Overseer"] else "Student"
    if target_role == "Teacher":
        target_role = "Mentor"

    db_user = crud.get_user_by_email(db, email=email)
    if not db_user:
        random_pwd = security.get_password_hash(f"google-oauth-{email}")
        new_user = schemas.UserCreate(email=email, password=random_pwd, role=target_role)
        db_user = crud.create_user(db, new_user)
        crud.update_user_profile(db, db_user, schemas.ProfileUpdate(gmail=email))
    else:
        # Update user's active portal role if a role was selected on sign in
        if target_role and db_user.role != target_role:
            db_user.role = target_role
            db.commit()
            db.refresh(db_user)

    client_ip = request.client.host if request.client else "unknown"
    request.session["user"] = db_user.email
    crud.log_activity(
        db, 
        action="GOOGLE_LOGIN", 
        details=f"Logged in via Google Authentication ({name}) as {db_user.role}", 
        user_email=db_user.email, 
        ip_address=client_ip
    )

    return {
        "message": "Successfully logged in with Google",
        "email": db_user.email,
        "name": name,
        "picture": picture,
        "role": db_user.role,
    }

@router.post("/login")
def login(
    request: Request,
    form_data: OAuth2PasswordRequestForm = Depends(),
    role: Optional[str] = None,
    db: Session = Depends(database.get_db)
) -> dict:
    user = crud.get_user_by_email(db, email=form_data.username)
    client_ip = request.client.host if request.client else "unknown"

    target_role = "Mentor" if (role and role in ["Teacher", "Mentor"]) else (role if (role and role in ["Student", "Overseer"]) else "Student")

    if not user:
        # Create user account automatically if logging in for the first time
        hashed_pwd = security.get_password_hash(form_data.password)
        user = models.User(email=form_data.username, hashed_password=hashed_pwd, role=target_role)
        db.add(user)
        db.commit()
        db.refresh(user)
    elif not security.verify_password(form_data.password, user.hashed_password):
        crud.log_activity(db, action="FAILED_LOGIN", user_email=form_data.username, ip_address=client_ip)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    else:
        # Update user's active role if specified during login
        if role and role in ["Student", "Mentor", "Teacher", "Overseer"]:
            if user.role != target_role:
                user.role = target_role
                db.commit()
                db.refresh(user)

    # Set the user in the session
    request.session["user"] = user.email
    crud.log_activity(db, action="LOGIN", user_email=user.email, ip_address=client_ip)
    return {"message": "Successfully logged in", "role": user.role}

@router.post("/logout")
def logout(request: Request, db: Session = Depends(database.get_db)) -> dict:
    user_email = request.session.get("user")
    if user_email:
        client_ip = request.client.host if request.client else "unknown"
        crud.log_activity(db, action="LOGOUT", user_email=user_email, ip_address=client_ip)
    request.session.pop("user", None)
    return {"message": "Successfully logged out"}

@router.get("/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(security.get_current_user)) -> models.User:
    return current_user

@router.put("/profile", response_model=schemas.User)
def update_profile(
    profile: schemas.ProfileUpdate,
    request: Request,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(database.get_db)
) -> models.User:
    updated_user = crud.update_user_profile(db, current_user, profile)
    client_ip = request.client.host if request.client else "unknown"
    crud.log_activity(
        db,
        action="PROFILE_UPDATED",
        details=f"Contact info updated (telegram, gmail, phone)",
        user_email=current_user.email,
        ip_address=client_ip,
    )
    return updated_user

@router.get("/logs", response_model=list[schemas.ActivityLog])
def get_activity_logs(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(RoleChecker(["Overseer"]))
) -> list[models.ActivityLog]:
    
    logs = crud.get_recent_activity_logs(db, limit=100)
    
    # Convert datetime to string for response using Pydantic models in schema
    for log in logs:
        if log.timestamp:
            log.timestamp = log.timestamp.isoformat()
            
    return logs
