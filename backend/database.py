import os
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("Database")

# Load environment variables
load_dotenv()

DB_TYPE = os.getenv("DB_TYPE", "sqlite").lower()

def get_database_url():
    if DB_TYPE == "mysql":
        user = os.getenv("DB_USER", "root")
        password = os.getenv("DB_PASSWORD", "")
        host = os.getenv("DB_HOST", "localhost")
        port = os.getenv("DB_PORT", "3306")
        name = os.getenv("DB_NAME", "student_performance_db")
        # pymysql driver
        return f"mysql+pymysql://{user}:{password}@{host}:{port}/{name}"
    else:
        project_root = os.path.dirname(os.path.dirname(__file__))
        default_sqlite = os.path.join(project_root, "db", "student_performance.db")
        sqlite_file = os.getenv("SQLITE_FILE", default_sqlite)
        return f"sqlite:///{sqlite_file}"

db_url = get_database_url()
logger.info(f"Connecting to database: {db_url.split('@')[-1] if '@' in db_url else db_url}")

# Create engine with options
connect_args = {}
if db_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

try:
    engine = create_engine(db_url, connect_args=connect_args)
    # Test connection
    with engine.connect() as conn:
        logger.info("Database connection established successfully.")
except Exception as e:
    logger.error(f"Failed to connect to MySQL/configured database: {e}")
    if DB_TYPE == "mysql":
        logger.warning("Falling back to SQLite database for stability...")
        project_root = os.path.dirname(os.path.dirname(__file__))
        default_sqlite = os.path.join(project_root, "db", "student_performance.db")
        sqlite_file = os.getenv("SQLITE_FILE", default_sqlite)
        fallback_url = f"sqlite:///{sqlite_file}"
        engine = create_engine(fallback_url, connect_args={"check_same_thread": False})
        logger.info("SQLite fallback engine created successfully.")
    else:
        raise e

# Create declarative base and sessionmaker
Base = declarative_base()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    """Dependency helper to get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
