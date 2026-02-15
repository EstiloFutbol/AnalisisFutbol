import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv
from typing import List, Optional

# Load environment variables from .env file if it exists
load_dotenv()

class Settings(BaseSettings):
    # API configuration
    API_V1_STR: str = "/api"
    PROJECT_NAME: str = "Estilo Futbol"
    # Documentation and auth controls
    ENABLE_DOCS: bool = os.getenv("ENABLE_DOCS", "true").lower() == "true"
    REQUIRE_AUTH: bool = os.getenv("REQUIRE_AUTH", "false").lower() == "true"
    
    # Security configuration
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # API Key authentication
    API_KEY: str = os.getenv("API_KEY", "your-api-key-change-in-production")
    
    # Admin credentials
    ADMIN_USERNAME: str = os.getenv("ADMIN_USERNAME", "Joselu")
    ADMIN_PASSWORD: str = os.getenv("ADMIN_PASSWORD", "1234Cl@verlito")
    
    # StatsBomb API configuration
    # Currently using open data, but prepared for private API in the future
    STATSBOMB_USE_PRIVATE_API: bool = False
    STATSBOMB_API_KEY: str = os.getenv("STATSBOMB_API_KEY", "")
    STATSBOMB_API_URL: str = os.getenv("STATSBOMB_API_URL", "")
    
    # Database configuration
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./estilo_futbol.db")
    
    # Redis configuration for caching
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")
    # Default disabled in dev to avoid slow startup if Redis is unavailable
    REDIS_ENABLED: bool = os.getenv("REDIS_ENABLED", "false").lower() == "true"
    
    # Cache configuration
    CACHE_DEFAULT_EXPIRE: int = int(os.getenv("CACHE_DEFAULT_EXPIRE", "3600"))  # 1 hour default
    CACHE_COMPETITIONS_EXPIRE: int = int(os.getenv("CACHE_COMPETITIONS_EXPIRE", "86400"))  # 24 hours
    CACHE_MATCHES_EXPIRE: int = int(os.getenv("CACHE_MATCHES_EXPIRE", "7200"))  # 2 hours
    CACHE_PLAYERS_EXPIRE: int = int(os.getenv("CACHE_PLAYERS_EXPIRE", "3600"))  # 1 hour
    CACHE_HEATMAP_EXPIRE: int = int(os.getenv("CACHE_HEATMAP_EXPIRE", "1800"))  # 30 minutes
    
    # Background sync configuration
    # Default disabled in dev to speed up startup
    BACKGROUND_SYNC_ENABLED: bool = os.getenv("BACKGROUND_SYNC_ENABLED", "false").lower() == "true"
    SYNC_INTERVAL_MINUTES: int = int(os.getenv("SYNC_INTERVAL_MINUTES", "60"))  # Sync every hour
    
    # CORS settings - restrict in production
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:8080",
        "https://estilo-futbol.vercel.app"
    ]
    
    class Config:
        case_sensitive = True

# Create settings instance
settings = Settings()