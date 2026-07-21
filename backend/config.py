from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    session_secret_key: str = "fallback-secret-key"
    api_secret_key: str = "super-secret-api-key-for-ai-access"
    database_url: str = "sqlite:///./industrial.db"
    environment: str = "development"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
