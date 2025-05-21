import os
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DB_PATH = os.path.join(BASE_DIR, "data", "todo.db")

class Settings(BaseSettings):
    DATABASE_URL: str = f"sqlite:///{DB_PATH}"
    VALID_GEMINI_MODELS = ["gemini-2.0-flash"]
    VALID_OPENAI_MODELS = ["gpt-4o"]
    GEMINI_API_KEY: str = ""
    OPENAI_API_KEY: str = ""
    model_config = SettingsConfigDict(env_file="backend/.env")

settings = Settings()