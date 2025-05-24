from sqlmodel import Session, select
from fastapi import HTTPException
from app.schemas.task_tag import Task, TaskCreate, TaskUpdate, Tag


class TaskService:
    def __init__(self, session: Session):
        self.session = session

    def create_task(self, task_create: TaskCreate) -> Task:
        task_db = Task.model_validate(task_create)
        self.session.add(task_db)
        self.session.commit()
        self.session.refresh(task_db)
        return task_db

    def get_task_page(self, offset: int, limit: int):
        return self.session.exec(select(Task).offset(offset).limit(limit)).all()

    def get_task(self, task_id: int) -> Task:
        task_db = self.session.get(Task, task_id)
        if not task_db:
            raise HTTPException(status_code=404, detail="Task not found")
        return task_db

    def delete_task(self, task_id: int):
        task_db = self.session.get(Task, task_id)
        if not task_db:
            raise HTTPException(status_code=404, detail="Task not found")
        self.session.delete(task_db)
        self.session.commit()

    def edit_task(self, task_id: int, task_update: TaskUpdate) -> Task:
        # exclude_unset=True : This tells Pydantic to not include the values that were not sent by the client.
        task_update_dumped = task_update.model_dump(exclude_unset=True)

        task_db = self.session.get(Task, task_id)
        if not task_db:
            raise HTTPException(status_code=404, detail="Task not found")
        task_db.sqlmodel_update(task_update_dumped)

        self.session.add(task_db)
        self.session.commit()
        self.session.refresh(task_db)
        return task_db

    def tag(self, task_id: int, tag_id: int) -> Task:
        task_db = self.session.get(Task, task_id)
        if not task_db:
            raise HTTPException(status_code=404, detail="Task not found")

        tag_db = self.session.get(Tag, tag_id)
        if not tag_db:
            raise HTTPException(status_code=404, detail="Tag not found")

        if tag_db in task_db.tags:
            raise HTTPException(status_code=400, detail="Tag already exists in task")

        task_db.tags.append(tag_db)
        self.session.add(task_db)
        self.session.commit()
        self.session.refresh(task_db)
        return task_db

    def untag(self, task_id: int, tag_id: int) -> Task:
        task_db = self.session.get(Task, task_id)
        if not task_db:
            raise HTTPException(status_code=404, detail="Task not found")

        tag_db = self.session.get(Tag, tag_id)
        if not tag_db:
            raise HTTPException(status_code=404, detail="Tag not found")

        if tag_db not in task_db.tags:
            raise HTTPException(status_code=400, detail="Tag does not exist in task")

        task_db.tags.remove(tag_db)
        self.session.add(task_db)
        self.session.commit()
        self.session.refresh(task_db)
        return task_db
