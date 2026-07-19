from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    role: str

    class Config:
        from_attributes = True

class ActivityLog(BaseModel):
    id: int
    user_email: str | None = None
    action: str
    details: str | None = None
    ip_address: str | None = None
    timestamp: str | None = None # Can be datetime but string is easier for JSON serialization

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str | None = None

# ── Integration Schemas ──────────────────────────────────────
class IntegrationCreate(BaseModel):
    type: str          # 'lms_sync', 'sso', 'data_lake'
    provider: str      # 'canvas', 'blackboard', 'moodle', 'azure_ad', 'okta', 'custom'
    name: str
    config_url: str | None = None
    api_key: str | None = None

class IntegrationUpdate(BaseModel):
    config_url: str | None = None
    api_key: str | None = None
    is_active: bool | None = None

class IntegrationOut(BaseModel):
    id: int
    type: str
    provider: str
    name: str
    config_url: str | None = None
    is_active: bool
    status: str
    created_by: str | None = None
    created_at: str | None = None
    last_synced: str | None = None

    class Config:
        from_attributes = True
