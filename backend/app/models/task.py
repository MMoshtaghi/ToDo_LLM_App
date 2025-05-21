from sqlmodel import Field, SQLModel
from datetime import datetime


class TaskBase(SQLModel):
    title: str = Field(index=True) # index to be able to search
    description: str | None = None
    is_done: bool = False
    scheduled_for: datetime | None = Field(default=None, index=True) # index to be able to search


class TaskCreate(TaskBase):
    pass


class Task(TaskBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.now)


class TaskResponse(TaskBase):
    id: int
    created_at: datetime


# This is almost the same as TaskBase, but all the fields are optional, so we can't simply inherit from TaskBase.
class TaskUpdate(SQLModel):
    title: str | None = None
    description: str | None = None
    is_done: bool | None = None
    scheduled_for: datetime | None = None