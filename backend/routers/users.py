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
    
    return crud.create_user(db, user)

@router.post("/login")
def login(request: Request, form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)) -> dict:
    user = crud.get_user_by_email(db, email=form_data.username)
    client_ip = request.client.host if request.client else "unknown"

    if not user or not security.verify_password(form_data.password, user.hashed_password):
        crud.log_activity(db, action="FAILED_LOGIN", user_email=form_data.username, ip_address=client_ip)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
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
