from fastapi import APIRouter, Depends

from app.schemas.task_tag import Task, TaskCreate, TaskResponse, TaskUpdate


router = APIRouter()


@router.post("/smart_tag", response_model=TaskResponse)
def smart_tagging(task_id:int):
    pass