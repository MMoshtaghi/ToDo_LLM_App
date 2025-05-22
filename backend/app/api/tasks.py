from fastapi import APIRouter, Depends, status, Query
from typing import Annotated

from app.db.database import Session, get_session
from app.schemas.task_tag import *
from app.services.task_service import TaskService

router = APIRouter()


# Dependency for task_service
def get_task_service(session:Session=Depends(get_session)) -> TaskService:
    return TaskService(session=session)


@router.post("/", response_model=TaskResponseWithTags)
def create_task(task:TaskCreate, task_service:TaskService=Depends(get_task_service)):
    return task_service.create_task(task)

@router.get("/tasks", response_model=list[TaskResponseWithTags])
def get_task_page(offset:int=0, limit:Annotated[int, Query(le=10)]=10, task_service:TaskService=Depends(get_task_service)):
    return task_service.get_task_page(offset=offset, limit=limit)

@router.get("/{task_id}", response_model=TaskResponseWithTags)
def get_task(task_id:int, task_service:TaskService=Depends(get_task_service)):
    return task_service.get_task(task_id=task_id)

@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id:int, task_service:TaskService=Depends(get_task_service)):
    return task_service.delete_task(task_id=task_id)

@router.patch("/{task_id}", response_model=TaskResponseWithTags)
def edit_task(task_id:int, task_update:TaskUpdate, task_service:TaskService=Depends(get_task_service)):
    return task_service.edit_task(task_id=task_id, task_update=task_update)
# Mark as Done can be done via edit_task
