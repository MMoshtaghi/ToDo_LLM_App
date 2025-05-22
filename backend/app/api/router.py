from fastapi import APIRouter
from app.api import tasks, tags, ai

api_router = APIRouter()
api_router.include_router(router=tasks.router, prefix="/tasks", tags=["tasks"])
api_router.include_router(router=tags.router, prefix="/tags", tags=["tags"])
api_router.include_router(router=ai.router, prefix="/ai", tags=["ai"])