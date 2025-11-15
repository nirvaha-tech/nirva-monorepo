"""
Application configuration and settings

Copyright (c) 2024 Nirvahatech. All rights reserved.
This software is proprietary and confidential.
"""

import re
from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings and configuration"""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

    # API Settings
    PROJECT_NAME: str = "Nirvahatech API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # Database Settings
    DATABASE_URL: Optional[str] = None  # Will be read from Railway/Neon env var
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "nirvahatech"
    POSTGRES_PORT: int = 5432

    def get_database_url(self) -> str:
        """
        Get database URL, prioritizing DATABASE_URL env var (Railway/Neon).
        Falls back to constructing from individual components for local development.
        
        Handles SSL parameters correctly for asyncpg (removes 'sslmode', asyncpg handles SSL automatically).
        """
        if self.DATABASE_URL:
            # Railway/Neon provides DATABASE_URL - use it directly
            db_url = self.DATABASE_URL
            
            # Convert postgres:// to postgresql+asyncpg:// if needed
            if db_url.startswith("postgres://") and not db_url.startswith("postgresql://"):
                db_url = db_url.replace("postgres://", "postgresql+asyncpg://", 1)
            elif not db_url.startswith("postgresql+asyncpg://"):
                db_url = db_url.replace("postgresql://", "postgresql+asyncpg://", 1)
            
            # Remove SSL parameters - asyncpg doesn't support them as URL parameters
            # asyncpg handles SSL automatically when connecting to remote hosts
            db_url = re.sub(r'[?&]sslmode=[^&]*', '', db_url)
            db_url = re.sub(r'[?&]ssl=[^&]*', '', db_url)
            # Clean up any trailing ? or &
            db_url = db_url.rstrip('?&')
            
            return db_url
        
        # Fallback: construct from individual components (local development)
        return (
            f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )

    # CORS - accepts either comma-separated string or already parsed list
    BACKEND_CORS_ORIGINS: str = "http://localhost:3000,http://localhost:8000,http://frontend:3000"

    def get_cors_origins(self) -> List[str]:
        """Parse CORS origins from comma-separated string"""
        if isinstance(self.BACKEND_CORS_ORIGINS, str):
            return [origin.strip() for origin in self.BACKEND_CORS_ORIGINS.split(",") if origin.strip()]
        return []


# Create settings instance
settings = Settings()
