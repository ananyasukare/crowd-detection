import os
from pydantic_settings import BaseSettings
from typing import Optional
from dotenv import load_dotenv
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
load_dotenv(BASE_DIR / ".env")

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Geospatial Queue Management"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "jwt-secret-key-here")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    MONGODB_URI: str = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
    DATABASE_NAME: str = "queue_db"
    
    # AI/ML Settings
    MODEL_PATH: str = "yolov8n.pt"
    
    # Notification Settings
    MAIL_USERNAME: Optional[str] = os.getenv("MAIL_USERNAME") or os.getenv("SMTP_USER")
    MAIL_PASSWORD: Optional[str] = os.getenv("MAIL_PASSWORD") or os.getenv("SMTP_PASSWORD")
    MAIL_FROM: Optional[str] = os.getenv("MAIL_FROM") or os.getenv("MAIL_USERNAME") or os.getenv("SMTP_USER")
    MAIL_PORT: int = int(os.getenv("MAIL_PORT", 587))
    MAIL_SERVER: Optional[str] = os.getenv("MAIL_SERVER") or "smtp.gmail.com"
    SMTP_USER: Optional[str] = os.getenv("SMTP_USER")
    SMTP_PASSWORD: Optional[str] = os.getenv("SMTP_PASSWORD")
    ALERT_EMAIL_RECIPIENT: Optional[str] = os.getenv("ALERT_EMAIL_RECIPIENT")
    MAIL_FROM_NAME: str = PROJECT_NAME

    # Default Super Admin
    SUPER_ADMIN_EMAIL: str = os.getenv("SUPER_ADMIN_EMAIL", "superadmin@example.com")
    SUPER_ADMIN_PASSWORD: str = os.getenv("SUPER_ADMIN_PASSWORD", "admin123")

    class Config:
        case_sensitive = True
        env_file = ".env"
        extra = "ignore"

settings = Settings()
