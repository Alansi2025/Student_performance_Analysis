import os
import socket
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

load_dotenv()

SQLITE_FALLBACK = "sqlite:///./industrial.db"

def _pg_is_reachable(url: str, timeout: float = 2.0) -> bool:
    """Quick TCP check — returns True if PostgreSQL is accepting connections."""
    try:
        # Parse host:port from postgresql://user:pass@host:port/db
        from urllib.parse import urlparse
        parsed = urlparse(url)
        host = parsed.hostname or "localhost"
        port = parsed.port or 5432
        sock = socket.create_connection((host, port), timeout=timeout)
        sock.close()
        return True
    except (OSError, TypeError):
        return False

# Decide which database to use
_configured_url = os.getenv("DATABASE_URL", "")
if _configured_url and _configured_url.startswith("postgresql"):
    if _pg_is_reachable(_configured_url):
        SQLALCHEMY_DATABASE_URL = _configured_url
        print(f"  ✅ Connected to PostgreSQL")
    else:
        SQLALCHEMY_DATABASE_URL = SQLITE_FALLBACK
        print(f"  ⚠️  PostgreSQL unreachable — using SQLite fallback (industrial.db)")
else:
    SQLALCHEMY_DATABASE_URL = _configured_url or SQLITE_FALLBACK

# check_same_thread=False is needed only for SQLite in FastAPI
connect_args = {"check_same_thread": False} if SQLALCHEMY_DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args=connect_args
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
