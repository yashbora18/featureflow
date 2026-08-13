from unittest.mock import MagicMock
from app.services.evaluation_service import evaluate_flag


class MockFlag:
    def __init__(self):
        self.id = 1
        self.flag_key = "dark_mode"
        self.enabled = True
        self.default_value = False
        self.rollout_percentage = 100


def test_percentage_rollout():
    db = MagicMock()

    flag = MockFlag()

    db.query.return_value.filter.return_value.first.side_effect = [
        flag,
        None,
        None,
    ]

    result = evaluate_flag(
        "dark_mode",
        1,
        db,
        {
            "evaluation_type": "user",
            "evaluation_value": "user001"
        }
    )

    assert result["enabled"] is True