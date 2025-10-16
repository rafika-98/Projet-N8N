from functools import lru_cache
from pydantic import BaseSettings, Field


class Settings(BaseSettings):
    app_name: str = "Le Gourmet du Sahel API"
    mongo_url: str = Field("mongodb://mongo:27017", env="MONGO_URL")
    mongo_db: str = Field("gourmet_db", env="MONGO_DB")
    jwt_secret_key: str = Field("supersecretkey", env="JWT_SECRET_KEY")
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24
    admin_email: str = Field("admin@legourmet.com", env="ADMIN_EMAIL")
    admin_password: str = Field("Admin123!", env="ADMIN_PASSWORD")

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
