import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine

from app.db.database import get_session
from app.schemas.task_tag import *
from main import app


@pytest.fixture(name="session")
def db_session():
    engine = create_engine(url="sqlite:///./test.db", connect_args={"check_same_thread": False}, echo=True)
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session
    SQLModel.metadata.drop_all(engine)


@pytest.fixture(name="client")  
def client_fixture(session: Session):  
    def get_session_override():  
        return session
    app.dependency_overrides[get_session] = get_session_override  
    client = TestClient(app)  
    yield client  
    app.dependency_overrides.clear() 