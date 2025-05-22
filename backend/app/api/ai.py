from fastapi import APIRouter, Depends
from app.db.database import Session, get_session
from app.schemas.task_tag import *
from app.services.ai_service import AIService
from app.services.task_service import TaskService
from app.services.tag_service import TagService

router = APIRouter()


# Dependency for ai_service
def get_ai_service() -> AIService:
    return AIService()

# Dependency for task_service
def get_task_service(session:Session=Depends(get_session)) -> TaskService:
    return TaskService(session=session)

def get_tag_service(session:Session=Depends(get_session)) -> TagService:
    return TagService(session=session)


@router.post("/{task_id}", response_model=TaskResponseWithTags)
def single_smart_tag(task_id:int,
                     session:Session = Depends(get_session), 
                     ai_service:AIService=Depends(get_ai_service)):
    return ai_service.single_smart_tag(task_id=task_id, task_service=TaskService(session), tag_service=TagService(session))

