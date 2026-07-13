from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_evaluation_home():
    response = client.post(
        "/evaluate/",
        json={
            "flag_key": "new_dashboard",
            "environment": "production",
            "user": "rahul"
        }
    )

    assert response.status_code == 200


def test_environment_override():
    response = client.post(
        "/evaluate/",
        json={
            "flag_key": "new_dashboard",
            "environment": "production",
            "user": "rahul"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["enabled"] == False
    assert data["reason"] == "Production override applied"


def test_disabled_flag():
    response = client.post(
        "/evaluate/",
        json={
            "flag_key": "new_dashboard",
            "environment": "development",
            "user": "rahul"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["enabled"] == False

    
def test_empty_user_context():
    response = client.post(
        "/evaluate/",
        json={
            "flag_key": "new_dashboard",
            "environment": "development"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["enabled"] == False