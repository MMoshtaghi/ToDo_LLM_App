from sqlmodel import Field, SQLModel


class TaskTagLink(SQLModel, table=True):
    task_id : int = Field(default=None, primary_key=True, foreign_key="task.id")
    tag_id : int = Field(default=None, primary_key=True, foreign_key="tag.id")