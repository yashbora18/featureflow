from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_get_audit_logs():

    response = client.get("/audit-logs/")

    assert response.status_code == 200

    logs = response.json()

    assert isinstance(logs, list)

    if logs:
        assert "action" in logs[0]
        assert "actor" in logs[0]
        assert "flag_key" in logs[0]
        assert "timestamp" in logs[0]