from fastapi import APIRouter, Depends, status, Query
from typing import Annotated

from app.db.database import Session, get_session
from app.schemas.task_tag import *
from app.services.tag_service import TagService

router = APIRouter()


# Dependency for tag_service
def get_tag_service(session:Session=Depends(get_session)) -> TagService:
    return TagService(session=session)


@router.post("/", response_model=TagResponseWithTasks)
def create_tag(tag:TagCreate, tag_service:TagService=Depends(get_tag_service)):
    return tag_service.create_tag(tag)

@router.get("/tag_page", response_model=list[TagResponseWithTasks])
def get_tag_page(offset:int=0, limit:Annotated[int, Query(le=10)]=10, tag_service:TagService=Depends(get_tag_service)):
    return tag_service.get_tag_page(offset=offset, limit=limit)

@router.get("/{tag_id}", response_model=TagResponseWithTasks)
def get_tag(tag_id:int, tag_service:TagService=Depends(get_tag_service)):
    return tag_service.get_tag(tag_id=tag_id)

@router.delete("/{tag_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_tag(tag_id:int, tag_service:TagService=Depends(get_tag_service)):
    return tag_service.delete_tag(tag_id=tag_id)

@router.patch("/{tag_id}/edit", response_model=TagResponseWithTasks)
def edit_tag(tag_id:int, tag_update:TagUpdate, tag_service:TagService=Depends(get_tag_service)):
    return tag_service.edit_tag(tag_id=tag_id, tag_update=tag_update)

