from fastapi import APIRouter
from app.api import tasks, ai

api_router = APIRouter()
api_router.include_router(router=tasks.router, prefix="/tasks", tags=["tasks"])
api_router.include_router(router=ai.router, prefix="/ai", tags=["ai"])