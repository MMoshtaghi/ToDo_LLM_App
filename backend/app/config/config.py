import os
from pydantic_settings import BaseSettings, SettingsConfigDict

# BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
# DB_PATH = os.path.join(BASE_DIR, "data", "todo.db")


class Settings(BaseSettings):
    DATABASE_URL: str = ""
    VALID_GEMINI_MODELS: list[str] = ["gemini-2.0-flash"]
    VALID_OPENAI_MODELS: list[str] = ["gpt-4o"]
    GEMINI_API_KEY: str = ""
    OPENAI_API_KEY: str = ""
    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()
