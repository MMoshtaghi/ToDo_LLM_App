from fastapi.testclient import TestClient
from sqlmodel import Session

from app.schemas.task_tag import *


def test_create_task(client: TestClient):
    pass


def test_create_task_incomplete(client: TestClient):
    pass


def test_create_task_invalid(client: TestClient):
    pass


def test_get_taskes(session: Session, client: TestClient):
    pass


def test_get_task(session: Session, client: TestClient):
    pass


def test_edit_task(session: Session, client: TestClient):
    pass


def test_delete_task(session: Session, client: TestClient):
    pass