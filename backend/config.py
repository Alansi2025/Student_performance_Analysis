import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    session_secret_key: str = "fallback-secret-key"
    api_secret_key: str = "super-secret-api-key-for-ai-access"
    database_url: str = "sqlite:///./industrial.db"
    environment: str = "development"

    # PaddleOCR model cache directory (set PADDLE_HOME in .env to override)
    paddle_home: str = os.path.join(os.path.expanduser("~"), ".paddleocr")

    # Ollama local LLM settings
    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "gemma4:12b"

    # Gemini Cloud LLM settings (Primary)
    gemini_api_key: str = ""
    gemini_model: str = "gemini-3.6-flash"

    # Google OAuth settings
    google_client_id: str = ""

    # Google Cloud Storage settings
    gcp_project_id: str = "studentperformance-498100"
    gcs_bucket_name: str = "studentperformance-498100-storage"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
