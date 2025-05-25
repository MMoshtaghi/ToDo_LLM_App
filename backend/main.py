from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.api.router import api_router
from app.db.database import create_db_and_tables


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(title="Todo LLM App", lifespan=lifespan)
app.include_router(api_router)

origins = [
    "http://localhost:5173",    # Vite dev server
    "http://localhost:3000",    # React dev server
    "http://localhost:80"       # Nginx served frontend
    "http://localhost",         # Nginx without explicit port
    # Add your production domain when deploying
    # "https://yourdomain.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["*"] to allow all (not recommended for production)
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "healthy"}