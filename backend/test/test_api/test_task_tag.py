from fastapi.testclient import TestClient
from sqlmodel import Session
from datetime import datetime, timedelta

from app.schemas.task_tag import *


def test_create_task(client: TestClient):
    data = {
        "title": "Test Task",
        "description": "Test Description",
        "scheduled_for": (datetime.now() + timedelta(days=1)).isoformat(),
        "is_done": False
    }
    response = client.post("/tasks/", json=data)
    assert response.status_code == 200
    resp = response.json()
    assert resp["title"] == data["title"]
    assert resp["description"] == data["description"]
    assert resp["is_done"] is False
    assert "id" in resp

def test_create_task_incomplete(client: TestClient):
    # Missing required 'title'
    data = {
        "description": "No title"
    }
    response = client.post("/tasks/", json=data)
    assert response.status_code == 422

def test_create_task_invalid(client: TestClient):
    # Invalid type for is_done
    data = {
        "title": "Invalid Task",
        "is_done": "notabool"
    }
    response = client.post("/tasks/", json=data)
    assert response.status_code == 422


def test_get_taskes(client: TestClient):
    # Create a task first
    task = TaskCreate(title="Get Tasks", description="desc")
    client.post("/tasks/", json=task.model_dump())
    response = client.get("/tasks/task_page")
    assert response.status_code == 200
    tasks = response.json()
    assert isinstance(tasks, list)
    assert any(t["title"] == "Get Tasks" for t in tasks)

def test_get_task(client: TestClient):
    # Create a task and fetch it
    task = TaskCreate(title="Single Task", description="desc")
    resp = client.post("/tasks/", json=task.model_dump())
    task_id = resp.json()["id"]
    response = client.get(f"/tasks/{task_id}")
    assert response.status_code == 200
    assert response.json()["title"] == "Single Task"

def test_edit_task(client: TestClient):
    # Create and edit a task
    task = TaskCreate(title="Edit Me", description="desc")
    resp = client.post("/tasks/", json=task.model_dump())
    task_id = resp.json()["id"]
    update = {"title": "Edited", "is_done": True}
    response = client.patch(f"/tasks/{task_id}/edit", json=update)
    assert response.status_code == 200
    assert response.json()["title"] == "Edited"
    assert response.json()["is_done"] is True

def test_delete_task(client: TestClient):
    # Create and delete a task
    task = TaskCreate(title="Delete Me", description="desc")
    resp = client.post("/tasks/", json=task.model_dump())
    task_id = resp.json()["id"]
    response = client.delete(f"/tasks/{task_id}")
    assert response.status_code == 204
    # Confirm deletion
    response = client.get(f"/tasks/{task_id}")
    assert response.status_code == 404

def test_tag_and_untag_task(client: TestClient):
    # Create a tag
    tag_resp = client.post("/tags/", json={"tag": "urgent"})
    tag_id = tag_resp.json()["id"]
    # Create a task
    task_resp = client.post("/tasks/", json={"title": "Tag Test"})
    task_id = task_resp.json()["id"]
    # Tag the task
    response = client.patch(f"/tasks/{task_id}/tag", params={"tag_id": tag_id})
    # Check task's tags
    assert any(t["id"] == tag_id for t in response.json()["tags"])
    # Check tag's tasks
    tag_get_resp = client.get(f"/tags/{tag_id}")
    assert tag_get_resp.status_code == 200
    assert any(t["id"] == task_id for t in tag_get_resp.json()["tasks"])
    # Untag the task
    response = client.patch(f"/tasks/{task_id}/untag", params={"tag_id": tag_id})
    assert response.status_code == 200
    # Check task's tags
    assert all(t["id"] != tag_id for t in response.json()["tags"])
    # Check tag's tasks
    tag_get_resp = client.get(f"/tags/{tag_id}")
    assert tag_get_resp.status_code == 200
    assert all(t["id"] != task_id for t in tag_get_resp.json()["tasks"])

# -----------------------------------------------------------------

def test_create_tag(client: TestClient):
    data = {"tag": "work"}
    response = client.post("/tags/", json=data)
    assert response.status_code == 200
    resp = response.json()
    assert resp["tag"] == data["tag"]
    assert "id" in resp

def test_create_tag_incomplete(client: TestClient):
    # Missing required 'tag'
    data = {}
    response = client.post("/tags/", json=data)
    assert response.status_code == 422


def test_get_tags(client: TestClient):
    # Create a tag first
    client.post("/tags/", json={"tag": "personal"})
    response = client.get("/tags/tag_page")
    assert response.status_code == 200
    tags = response.json()
    assert isinstance(tags, list)
    assert any(t["tag"] == "personal" for t in tags)

def test_get_tag(client: TestClient):
    # Create a tag and fetch it
    resp = client.post("/tags/", json={"tag": "shopping"})
    tag_id = resp.json()["id"]
    response = client.get(f"/tags/{tag_id}")
    assert response.status_code == 200
    assert response.json()["tag"] == "shopping"

def test_edit_tag(client: TestClient):
    # Create and edit a tag
    resp = client.post("/tags/", json={"tag": "editme"})
    tag_id = resp.json()["id"]
    update = {"tag": "edited"}
    # Note: There is a typo in your tags.py: "/{tag_id}/edit   " (extra spaces). Adjust if needed.
    response = client.patch(f"/tags/{tag_id}/edit", json=update)
    assert response.status_code == 200
    assert response.json()["tag"] == "edited"

def test_delete_tag(client: TestClient):
    # Create and delete a tag
    resp = client.post("/tags/", json={"tag": "deleteme"})
    tag_id = resp.json()["id"]
    response = client.delete(f"/tags/{tag_id}")
    assert response.status_code == 204
    # Confirm deletion
    response = client.get(f"/tags/{tag_id}")
    assert response.status_code == 404