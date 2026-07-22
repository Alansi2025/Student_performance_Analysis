from sqlalchemy import Boolean, Column, Integer, String, DateTime
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="Student") # 'Student', 'Mentor', 'Overseer'
    is_active = Column(Boolean, default=True)
    telegram_id = Column(String, nullable=True)      # Telegram username e.g. @username
    gmail = Column(String, nullable=True)             # Contact Gmail address
    phone_number = Column(String, nullable=True)      # Phone number with country code

class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String, index=True, nullable=True)
    action = Column(String, nullable=False)
    details = Column(String, nullable=True)
    ip_address = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

class Integration(Base):
    __tablename__ = "integrations"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String, nullable=False)          # 'lms_sync', 'sso', 'data_lake'
    provider = Column(String, nullable=False)       # e.g. 'canvas', 'blackboard', 'moodle', 'azure_ad', 'okta', 'custom'
    name = Column(String, nullable=False)           # Display name
    config_url = Column(String, nullable=True)      # LMS base URL or SSO endpoint
    api_key = Column(String, nullable=True)         # Encrypted API key / client secret
    is_active = Column(Boolean, default=False)
    status = Column(String, default="disconnected") # 'connected', 'disconnected', 'error'
    created_by = Column(String, nullable=True)      # email of user who set it up
    created_at = Column(DateTime, default=datetime.utcnow)
    last_synced = Column(DateTime, nullable=True)
