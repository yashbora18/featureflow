import os


class Settings:
    DATABASE_URL: str = os.environ.get("DATABASE_URL", "")
    REDIS_URL: str = os.environ.get("REDIS_URL", "")
    PORT: int = int(os.environ.get("PORT", "8080"))
    ENV: str = os.environ.get("NODE_ENV", "development")
    VERSION: str = "1.0.0"


settings = Settings()
