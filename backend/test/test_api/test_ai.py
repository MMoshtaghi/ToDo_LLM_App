from unittest.mock import patch
from fastapi.testclient import TestClient
from fastapi import HTTPException

from app.schemas.task_tag import *
from app.services.ai_service import SmartTagResult


def test_single_smart_tag_hallucinated_tag(client: TestClient):
    # 1. LLM returns a tag that is already in current_tags (case-insensitive) -> ValueError -> HTTP 503
    
    # Create a Task
    task_resp = client.post("/tasks/", json={"title": "Test", "description": "desc"})
    task_id = task_resp.json()["id"]
    # Tag the task so it's in current_tags
    tag_resp = client.post("/tags/", json={"tag": "Work"})
    tag_id = tag_resp.json()["id"]
    client.patch(f"/tasks/{task_id}/tag", params={"tag_id": tag_id})

    # LLM returns the same tag (case-insensitive)
    with patch("app.services.ai_service.call_llm", return_value=SmartTagResult(tag_name="work", is_new=False)):
        response = client.post(f"/ai/{task_id}")
        assert response.status_code == 503
        assert "AI service temporarily unavailable" in response.text

def test_single_smart_tag_new_tag(client: TestClient):
    # 2. LLM returns a new tag (not in available_tags or current_tags) -> tag is created and assigned
    task_resp = client.post("/tasks/", json={"title": "Test new tag", "description": "desc"})
    task_id = task_resp.json()["id"]
    # No tags exist yet
    with patch("app.services.ai_service.call_llm", return_value=SmartTagResult(tag_name="BrandNew", is_new=True)):
        response = client.post(f"/ai/{task_id}")
        assert response.status_code == 200
        data = response.json()
        assert any(tag["tag"] == "BrandNew" for tag in data["tags"]) # tag has the LLM-generated name

def test_single_smart_tag_existing_available_tag(client: TestClient):
    # 3. LLM returns a tag that is in available_tags (not in current_tags) -> tag is assigned
    task_resp = client.post("/tasks/", json={"title": "Test", "description": "desc"})
    task_id = task_resp.json()["id"]
    tag_resp = client.post("/tags/", json={"tag": "Work"})
    tag_id = tag_resp.json()["id"]
    # Do NOT tag the task, so "Work" is in available_tags
    with patch("app.services.ai_service.call_llm", return_value=SmartTagResult(tag_name="Work", is_new=False)):
        response = client.post(f"/ai/{task_id}")
        assert response.status_code == 200
        data = response.json()
        assert any(tag["tag"].lower() == "work" for tag in data["tags"]) # tag has the name of the already available tag

def test_single_smart_tag_llm_exception(client: TestClient):
    # 4. LLM call raises an exception -> HTTP 503
    task_resp = client.post("/tasks/", json={"title": "Test", "description": "desc"})
    task_id = task_resp.json()["id"]
    with patch("app.services.ai_service.call_llm", side_effect=Exception("LLM crashed!")):
        response = client.post(f"/ai/{task_id}")
        assert response.status_code == 503
        assert "AI service temporarily unavailable" in response.text