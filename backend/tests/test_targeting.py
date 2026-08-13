from unittest.mock import MagicMock
from app.services.evaluation_service import evaluate_flag


class MockFlag:
    def __init__(self):
        self.id = 1
        self.flag_key = "dark_mode"
        self.enabled = True
        self.default_value = False
        self.rollout_percentage = 0


def create_db_with_user_rule():
    db = MagicMock()

    flag = MockFlag()

    db.query.return_value.filter.return_value.first.side_effect = [
        flag,          # Flag
        MagicMock(),   # User rule found
    ]

    return db


def create_db_with_group_rule():
    db = MagicMock()

    flag = MockFlag()

    db.query.return_value.filter.return_value.first.side_effect = [
        flag,
        MagicMock(),
    ]

    return db


def test_user_targeting():
    db = create_db_with_user_rule()

    result = evaluate_flag(
        "dark_mode",
        1,
        db,
        {
            "evaluation_type": "user",
            "evaluation_value": "user123"
        }
    )

    assert result["enabled"] is True
    assert result["reason"] == "Matched User Targeting"


def test_group_targeting():
    db = create_db_with_group_rule()

    result = evaluate_flag(
        "dark_mode",
        1,
        db,
        {
            "evaluation_type": "group",
            "evaluation_value": "beta_users"
        }
    )

    assert result["enabled"] is True
    assert result["reason"] == "Matched Group Targeting"