from pydantic_settings import BaseSettings
from typing import List
import json


class Settings(BaseSettings):
    # ------------------------------------------------------------------ #
    # Database                                                             #
    # ------------------------------------------------------------------ #
    DATABASE_URL: str

    # ------------------------------------------------------------------ #
    # JWT                                                                  #
    # ------------------------------------------------------------------ #
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # ------------------------------------------------------------------ #
    # Application                                                          #
    # ------------------------------------------------------------------ #
    APP_ENV: str = "development"
    DEBUG: bool = True
    CORS_ORIGINS: str = '["http://localhost:5173","http://localhost:5174"]'

    # ------------------------------------------------------------------ #
    # VAPID – Web Push Notifications                                       #
    # Leave blank to disable push notifications without crashing.         #
    # ------------------------------------------------------------------ #
    VAPID_PUBLIC_KEY: str = ""
    VAPID_PRIVATE_KEY: str = ""
    VAPID_EMAIL: str = "mailto:admin@lonestardental.com"

    # ------------------------------------------------------------------ #
    # SMTP – Email Notifications                                           #
    # All four credential fields must be non-empty for emails to be sent. #
    # Leave them blank (or omit from env) to silently skip email sending. #
    #                                                                      #
    # Port / TLS cheat-sheet:                                             #
    #   587  STARTTLS  → SMTP_PORT=587  SMTP_USE_TLS=false  (default)    #
    #   465  SSL/TLS   → SMTP_PORT=465  SMTP_USE_TLS=true               #
    # ------------------------------------------------------------------ #
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USE_TLS: bool = False   # True = implicit SSL (port 465)
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM_EMAIL: str = ""

    # ------------------------------------------------------------------ #
    # Helpers                                                              #
    # ------------------------------------------------------------------ #
    @property
    def cors_origins_list(self) -> List[str]:
        return json.loads(self.CORS_ORIGINS)

    @property
    def smtp_enabled(self) -> bool:
        """True only when every required SMTP credential is present."""
        return bool(
            self.SMTP_HOST
            and self.SMTP_USER
            and self.SMTP_PASSWORD
            and self.SMTP_FROM_EMAIL
        )

    class Config:
        # pydantic-settings reads env vars directly; the .env file is only a
        # convenience fallback for local (non-Docker) development.  Inside a
        # container every value must come from the compose `environment:` block.
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"


settings = Settings()
