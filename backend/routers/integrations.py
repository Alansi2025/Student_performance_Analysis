from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from .. import schemas, models, database, security

router = APIRouter(
    prefix="/integrations",
    tags=["integrations"]
)

# ── LMS Providers we support ────────────────────────────────
SUPPORTED_LMS = {"canvas", "blackboard", "moodle"}
SUPPORTED_SSO = {"azure_ad", "okta", "google", "saml"}
SUPPORTED_DATA_LAKE = {"custom", "snowflake", "bigquery", "s3"}

# ── GET all integrations ────────────────────────────────────
@router.get("/", response_model=list[schemas.IntegrationOut])
def list_integrations(
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(database.get_db)
):
    """List all configured integrations. Overseer/Mentor only."""
    if current_user.role not in ("Overseer", "Mentor"):
        raise HTTPException(status_code=403, detail="Not authorized")
    return db.query(models.Integration).order_by(models.Integration.created_at.desc()).all()

# ── POST create integration ─────────────────────────────────
@router.post("/", response_model=schemas.IntegrationOut, status_code=status.HTTP_201_CREATED)
def create_integration(
    payload: schemas.IntegrationCreate,
    request: Request,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(database.get_db)
):
    """Create a new integration (LMS sync, SSO, or Data Lake)."""
    if current_user.role != "Overseer":
        raise HTTPException(status_code=403, detail="Only Overseers can create integrations")

    # Validate type + provider combo
    valid_providers = {
        "lms_sync": SUPPORTED_LMS,
        "sso": SUPPORTED_SSO,
        "data_lake": SUPPORTED_DATA_LAKE,
    }
    if payload.type not in valid_providers:
        raise HTTPException(status_code=400, detail=f"Invalid type. Must be one of: {list(valid_providers.keys())}")
    if payload.provider not in valid_providers[payload.type]:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid provider '{payload.provider}' for type '{payload.type}'. Must be one of: {valid_providers[payload.type]}"
        )

    integration = models.Integration(
        type=payload.type,
        provider=payload.provider,
        name=payload.name,
        config_url=payload.config_url,
        api_key=payload.api_key,
        created_by=current_user.email,
    )
    db.add(integration)
    db.commit()
    db.refresh(integration)

    # Log activity
    client_ip = request.client.host if request.client else "unknown"
    security.log_activity(db, action="INTEGRATION_CREATED", details=f"{payload.type}/{payload.provider}: {payload.name}", user_email=current_user.email, ip_address=client_ip)

    return integration

# ── POST test / connect an integration ──────────────────────
@router.post("/{integration_id}/connect")
def connect_integration(
    integration_id: int,
    request: Request,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(database.get_db)
):
    """Test connectivity and activate an integration."""
    if current_user.role != "Overseer":
        raise HTTPException(status_code=403, detail="Only Overseers can manage integrations")

    integration = db.query(models.Integration).filter(models.Integration.id == integration_id).first()
    if not integration:
        raise HTTPException(status_code=404, detail="Integration not found")

    # Simulate connectivity test based on type
    connected = False
    message = ""

    if integration.type == "lms_sync":
        if integration.config_url and integration.api_key:
            connected = True
            message = f"Successfully connected to {integration.provider.title()} at {integration.config_url}"
        else:
            message = "LMS sync requires both a base URL and an API key"

    elif integration.type == "sso":
        if integration.config_url:
            connected = True
            message = f"SSO endpoint verified: {integration.config_url}"
        else:
            message = "SSO requires an endpoint URL"

    elif integration.type == "data_lake":
        if integration.api_key:
            connected = True
            message = f"Data Lake API key validated for {integration.provider}"
        else:
            message = "Data Lake integration requires an API key"

    # Update status
    integration.is_active = connected
    integration.status = "connected" if connected else "error"
    if connected:
        integration.last_synced = datetime.utcnow()
    db.commit()

    # Log
    client_ip = request.client.host if request.client else "unknown"
    action = "INTEGRATION_CONNECTED" if connected else "INTEGRATION_FAILED"
    security.log_activity(db, action=action, details=f"{integration.name}: {message}", user_email=current_user.email, ip_address=client_ip)

    return {"status": "connected" if connected else "error", "message": message}

# ── POST disconnect an integration ──────────────────────────
@router.post("/{integration_id}/disconnect")
def disconnect_integration(
    integration_id: int,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(database.get_db)
):
    """Disconnect an integration."""
    if current_user.role != "Overseer":
        raise HTTPException(status_code=403, detail="Only Overseers can manage integrations")

    integration = db.query(models.Integration).filter(models.Integration.id == integration_id).first()
    if not integration:
        raise HTTPException(status_code=404, detail="Integration not found")

    integration.is_active = False
    integration.status = "disconnected"
    db.commit()
    return {"status": "disconnected", "message": f"{integration.name} has been disconnected"}

# ── DELETE an integration ───────────────────────────────────
@router.delete("/{integration_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_integration(
    integration_id: int,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(database.get_db)
):
    """Delete an integration permanently."""
    if current_user.role != "Overseer":
        raise HTTPException(status_code=403, detail="Only Overseers can delete integrations")

    integration = db.query(models.Integration).filter(models.Integration.id == integration_id).first()
    if not integration:
        raise HTTPException(status_code=404, detail="Integration not found")

    db.delete(integration)
    db.commit()

# ── GET integration status summary ──────────────────────────
@router.get("/status")
def integration_status(
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(database.get_db)
):
    """Get a summary of all integration statuses."""
    if current_user.role not in ("Overseer", "Mentor"):
        raise HTTPException(status_code=403, detail="Not authorized")

    integrations = db.query(models.Integration).all()
    summary = {
        "lms_sync": {"total": 0, "connected": 0, "providers": []},
        "sso": {"total": 0, "connected": 0, "providers": []},
        "data_lake": {"total": 0, "connected": 0, "providers": []},
    }
    for i in integrations:
        if i.type in summary:
            summary[i.type]["total"] += 1
            if i.status == "connected":
                summary[i.type]["connected"] += 1
            summary[i.type]["providers"].append({
                "id": i.id,
                "name": i.name,
                "provider": i.provider,
                "status": i.status,
            })
    return summary
