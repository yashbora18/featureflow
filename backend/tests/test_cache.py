from unittest.mock import patch, MagicMock
from app.services.evaluation_service import evaluate_flag


class MockFlag:
    def __init__(self):
        self.id = 1
        self.flag_key = "dark_mode"
        self.enabled = True
        self.default_value = True
        self.rollout_percentage = 0


@patch("app.services.evaluation_service.redis_client")
def test_cache_hit(mock_redis):

    mock_redis.get.return_value = (
        '{"success": true,'
        '"flag_key":"dark_mode",'
        '"enabled": true,'
        '"reason":"Cached",'
        '"source":"live"}'
    )

    db = MagicMock()

    flag = MockFlag()

    db.query.return_value.filter.return_value.first.return_value = flag

    result = evaluate_flag("dark_mode", 1, db)

    assert result["source"] == "cached"