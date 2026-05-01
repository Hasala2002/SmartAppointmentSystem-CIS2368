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
    # Resend – Email Notifications                                         #
    # Uses HTTPS so it works on hosts that block SMTP ports (e.g. DO).   #
    # Sign up at https://resend.com, get an API key, verify your domain. #
    # Leave RESEND_API_KEY blank to silently skip email sending.          #
    # ------------------------------------------------------------------ #
    RESEND_API_KEY: str = ""
    # Must match a verified sender domain/address in your Resend account.
    # On the free plan you can use: onboarding@resend.dev for testing.
    RESEND_FROM_EMAIL: str = "onboarding@resend.dev"

    # ------------------------------------------------------------------ #
    # Helpers                                                              #
    # ------------------------------------------------------------------ #
    @property
    def cors_origins_list(self) -> List[str]:
        return json.loads(self.CORS_ORIGINS)

    @property
    def smtp_enabled(self) -> bool:
        """True only when Resend is configured."""
        return bool(self.RESEND_API_KEY)

    class Config:
        # pydantic-settings reads env vars directly; the .env file is only a
        # convenience fallback for local (non-Docker) development.  Inside a
        # container every value must come from the compose `environment:` block.
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"


settings = Settings()
