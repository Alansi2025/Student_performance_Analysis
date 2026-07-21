from sqlalchemy.orm import Session
from . import models, schemas

def get_user_by_email(db: Session, email: str) -> models.User | None:
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate) -> models.User:
    from .security import get_password_hash
    hashed_password = get_password_hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def log_activity(db: Session, action: str, details: str = None, user_email: str = None, ip_address: str = None) -> models.ActivityLog:
    new_log = models.ActivityLog(
        user_email=user_email,
        action=action,
        details=details,
        ip_address=ip_address
    )
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    return new_log

def get_recent_activity_logs(db: Session, limit: int = 100) -> list[models.ActivityLog]:
    return db.query(models.ActivityLog).order_by(models.ActivityLog.timestamp.desc()).limit(limit).all()

def get_integrations(db: Session) -> list[models.Integration]:
    return db.query(models.Integration).all()

def create_integration(db: Session, integration: schemas.IntegrationCreate, created_by: str) -> models.Integration:
    db_integration = models.Integration(
        **integration.model_dump(),
        created_by=created_by
    )
    db.add(db_integration)
    db.commit()
    db.refresh(db_integration)
    return db_integration

def get_integration_by_id(db: Session, integration_id: int) -> models.Integration | None:
    return db.query(models.Integration).filter(models.Integration.id == integration_id).first()

def delete_integration(db: Session, integration_id: int) -> bool:
    db_integration = get_integration_by_id(db, integration_id)
    if db_integration:
        db.delete(db_integration)
        db.commit()
        return True
    return False

def update_integration_status(db: Session, integration_id: int, is_active: bool, status: str) -> models.Integration | None:
    db_integration = get_integration_by_id(db, integration_id)
    if db_integration:
        db_integration.is_active = is_active
        db_integration.status = status
        db.commit()
        db.refresh(db_integration)
        return db_integration
    return None
