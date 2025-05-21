from fastapi import APIRouter, Depends

from app.db.database import Session, get_session
from app.models.task import TaskCreate, TaskResponse
from app.services.task_service import TaskService

router = APIRouter()


@router.post("/", response_model=TaskResponse)
def create_task(task:TaskCreate, session:Session=Depends(get_session)):
    task_service = TaskService(session=session)
    return task_service.create_task(task)

@router.get("/{task_id}", response_model=TaskResponse)
def get_task(task_id:int, session:Session=Depends(get_session)):
    task_service = TaskService(session=session)
    return task_service.get_task(task_id=task_id)

