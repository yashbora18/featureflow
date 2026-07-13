from unittest.mock import MagicMock
from app.services.evaluation_service import evaluate_flag


class MockFlag:
    def __init__(self, flag_key, enabled, default_value, flag_type="boolean"):
        self.flag_key = flag_key
        self.enabled = enabled
        self.default_value = default_value
        self.flag_type = flag_type
        self.environment_id = 1


def create_mock_db(flag):
    db = MagicMock()

    query = db.query.return_value
    filter_result = query.filter.return_value
    filter_result.first.return_value = flag

    return db


def test_flag_not_found():
    db = create_mock_db(None)

    result = evaluate_flag("dark_mode", 1, db)

    assert result["success"] is False


def test_enabled_flag():
    flag = MockFlag("dark_mode", True, True)

    db = create_mock_db(flag)

    result = evaluate_flag("dark_mode", 1, db)

    assert result["enabled"] is True


def test_disabled_flag():
    flag = MockFlag("dark_mode", False, True)

    db = create_mock_db(flag)

    result = evaluate_flag("dark_mode", 1, db)

    assert result["enabled"] is False


def test_empty_user_context():
    flag = MockFlag("dark_mode", True, True)

    db = create_mock_db(flag)

    result = evaluate_flag(
        "dark_mode",
        1,
        db,
        user_context={}
    )

    assert result["success"] is True