from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from .database import engine, Base
from .routers import users, ai, integrations
from .routers.ai import limiter
from .config import settings

# Create database tables automatically
Base.metadata.create_all(bind=engine)

def _auto_migrate():
    from sqlalchemy import text
    with engine.connect() as conn:
        for col in ["telegram_id", "gmail", "phone_number"]:
            try:
                conn.execute(text(f"ALTER TABLE users ADD COLUMN {col} VARCHAR;"))
                conn.commit()
            except Exception:
                pass

_auto_migrate()

def seed_accounts():
    from .database import SessionLocal
    from . import models, crud
    from .security import get_password_hash
    db = SessionLocal()
    try:
        # Seed Overseer
        overseer_email = "admin@aetherlearn.com"
        if not crud.get_user_by_email(db, email=overseer_email):
            hashed_pwd = get_password_hash("admin123")
            overseer = models.User(email=overseer_email, hashed_password=hashed_pwd, role="Overseer")
            db.add(overseer)
        
        # Seed Mentor
        mentor_email = "sarah@cyberdyne.sys"
        if not crud.get_user_by_email(db, email=mentor_email):
            hashed_pwd = get_password_hash("123456")
            mentor = models.User(email=mentor_email, hashed_password=hashed_pwd, role="Mentor")
            db.add(mentor)

        # Seed Student
        student_email = "alex@aetherlearn.com"
        if not crud.get_user_by_email(db, email=student_email):
            hashed_pwd = get_password_hash("123456")
            student = models.User(email=student_email, hashed_password=hashed_pwd, role="Student")
            db.add(student)

        db.commit()
    finally:
        db.close()

seed_accounts()


app = FastAPI(
    title="Industrial Dashboard API",
    description="Secure, robust backend for the Industrial Dashboard",
    version="1.1.0"
)

# Secure Session Middleware
SESSION_SECRET_KEY = settings.session_secret_key
app.add_middleware(SessionMiddleware, secret_key=SESSION_SECRET_KEY)

# Rate Limiter setup
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Robust CORS configuration
origins = [
    "http://localhost",
    "http://localhost:5173", # Vite dev server
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True, # Required for cookies/sessions
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router)
app.include_router(ai.router)
app.include_router(integrations.router)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Secure Backend is running with PostgreSQL & Session Auth"}
