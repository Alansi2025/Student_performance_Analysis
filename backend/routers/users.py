from fastapi import APIRouter, Depends, HTTPException, status, Request, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from .. import schemas, models, database, security

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

@router.post("/register", response_model=schemas.User, status_code=status.HTTP_201_CREATED)
def register_user(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = security.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = security.get_password_hash(user.password)
    new_user = models.User(email=user.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login")
def login(request: Request, form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    user = security.get_user_by_email(db, email=form_data.username)
    client_ip = request.client.host if request.client else "unknown"

    if not user or not security.verify_password(form_data.password, user.hashed_password):
        security.log_activity(db, action="FAILED_LOGIN", user_email=form_data.username, ip_address=client_ip)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    # Set the user in the session
    request.session["user"] = user.email
    security.log_activity(db, action="LOGIN", user_email=user.email, ip_address=client_ip)
    return {"message": "Successfully logged in", "role": user.role}

@router.post("/logout")
def logout(request: Request, db: Session = Depends(database.get_db)):
    user_email = request.session.get("user")
    if user_email:
        client_ip = request.client.host if request.client else "unknown"
        security.log_activity(db, action="LOGOUT", user_email=user_email, ip_address=client_ip)
    request.session.pop("user", None)
    return {"message": "Successfully logged out"}

@router.get("/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(security.get_current_user)):
    return current_user

@router.get("/logs")
def get_activity_logs(current_user: models.User = Depends(security.get_current_user), db: Session = Depends(database.get_db)):
    if current_user.role != "Overseer":
        raise HTTPException(status_code=403, detail="Not authorized. Overseer access required.")
    
    logs = db.query(models.ActivityLog).order_by(models.ActivityLog.timestamp.desc()).limit(100).all()
    # Serialize logs
    result = []
    for log in logs:
        result.append({
            "id": log.id,
            "user_email": log.user_email,
            "action": log.action,
            "details": log.details,
            "ip_address": log.ip_address,
            "timestamp": log.timestamp.isoformat() if log.timestamp else None
        })
    return result
