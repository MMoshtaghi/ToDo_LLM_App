from sqlmodel import Session, select
from fastapi import HTTPException
from app.schemas.task_tag import *


class TagService:
    def __init__(self, session:Session):
        self.session = session

    def create_tag(self, tag_create:TagCreate) -> Tag:
        tag_db = Tag.model_validate(tag_create)
        self.session.add(tag_db)
        self.session.commit()
        self.session.refresh(tag_db)
        return tag_db
    
    def get_tag_page(self, offset:int, limit:int):
        return self.session.exec( select(Tag).offset(offset).limit(limit) ).all()

    def get_tag(self, tag_id:int) -> Tag:
        tag_db = self.session.get(Tag, tag_id)
        if not tag_db:
            raise HTTPException(status_code=404, detail="Tag not found")
        return tag_db
    
    def delete_tag(self, tag_id:int):
        tag_db = self.session.get(Tag, tag_id)
        if not tag_db:
            raise HTTPException(status_code=404, detail="Tag not found")
        self.session.delete(tag_db)
        self.session.commit()
    
    def edit_tag(self, tag_id:int, tag_update:TagUpdate) -> Tag:
        # exclude_unset=True : This tells Pydantic to not include the values that were not sent by the client.
        tag_update_dumped = tag_update.model_dump(exclude_unset=True)

        tag_db = self.session.get(Tag, tag_id)
        if not tag_db:
            raise HTTPException(status_code=404, detail="Tag not found")
        tag_db.sqlmodel_update(tag_update_dumped)

        self.session.add(tag_db)
        self.session.commit()
        self.session.refresh(tag_db)
        return tag_db
   