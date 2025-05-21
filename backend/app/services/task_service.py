from sqlmodel import Session, select
from fastapi import HTTPException
from app.models.task import Task, TaskCreate, TaskResponse, TaskUpdate


class TaskService:
    def __init__(self, session:Session):
        self.session = session

    def create_task(self, task_create:TaskCreate) -> Task:
        task_db = Task.model_validate(task_create)
        self.session.add(task_db)
        self.session.commit()
        self.session.refresh(task_db)
        return task_db
    
    def get_task(self, task_id:int) -> Task:
        task_db = self.session.get(Task, task_id)
        if not task_db:
            raise HTTPException(status_code=404, detail="Task not found")
        return task_db