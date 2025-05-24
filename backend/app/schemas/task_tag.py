from sqlmodel import Field, SQLModel, Relationship
from datetime import datetime
from .link import TaskTagLink

# from typing import TYPE_CHECKING
# # Avoiding circular imports ar runtime
# if TYPE_CHECKING:
#     from .tag import Tag, TagResponse
# This project is simple and small. Let's not bother with circular imports !!


class TaskBase(SQLModel):
    title: str = Field(index=True)  # index to be able to search
    description: str | None = None
    is_done: bool = False
    scheduled_for: datetime | None = Field(
        default=None, index=True
    )  # index to be able to search


class TaskCreate(TaskBase):
    pass


class Task(TaskBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.now)
    tags: list["Tag"] = Relationship(back_populates="tasks", link_model=TaskTagLink)


class TaskResponse(TaskBase):
    id: int
    created_at: datetime


class TaskResponseWithTags(TaskResponse):
    tags: list["TagResponse"] = []


# This is almost the same as TaskBase, but all the fields are optional, so we can't simply inherit from TaskBase.
class TaskUpdate(SQLModel):
    title: str | None = None
    description: str | None = None
    is_done: bool | None = None
    scheduled_for: datetime | None = None


# ----------------------------------------------------------------------------------------------------


class TagBase(SQLModel):
    tag: str = Field(index=True)  # index to be able to search


class TagCreate(TagBase):
    pass


class Tag(TagBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    tasks: list[Task] = Relationship(back_populates="tags", link_model=TaskTagLink)


class TagResponse(TagBase):
    id: int


class TagResponseWithTasks(TagResponse):
    tasks: list[TaskResponse] = []


# This is almost exactly TagBase, bc the tag field is the only attribute.
class TagUpdate(TagBase):
    pass
