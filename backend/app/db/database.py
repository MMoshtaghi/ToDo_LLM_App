from sqlmodel import SQLModel, Session, create_engine
from app.config.config import settings

connect_args = {"check_same_thread": False}
engine = create_engine(url=settings.DATABASE_URL, echo=True, connect_args=connect_args)


# Dependency for Injection
def get_session():
    with Session(engine) as session:
        yield session


def create_db_and_tables():
    """Initialize the tables""" 
    SQLModel.metadata.create_all(engine)