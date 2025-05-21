from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///backend/data/todo.db"
    GEMINI_API_KEY: str = ""
    OPENAI_API_KEY: str = ""
    model_config = SettingsConfigDict(env_file="backend/.env")

settings = Settings()