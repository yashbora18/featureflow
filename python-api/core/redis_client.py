import os
from typing import Optional

_redis_client = None


def get_redis_client() -> Optional[object]:
    """Returns a Redis client if REDIS_URL is configured, else None."""
    global _redis_client
    if _redis_client is not None:
        return _redis_client

    redis_url = os.environ.get("REDIS_URL", "")
    if not redis_url:
        return None

    try:
        import redis
        _redis_client = redis.from_url(
            redis_url,
            decode_responses=True,
            socket_connect_timeout=2,
            socket_timeout=2,
        )
        _redis_client.ping()
        return _redis_client
    except Exception:
        return None


def check_redis_status() -> str:
    """Returns 'connected', 'not_configured', or 'error: <msg>'."""
    redis_url = os.environ.get("REDIS_URL", "")
    if not redis_url:
        return "not_configured"
    try:
        import redis
        r = redis.from_url(redis_url, socket_connect_timeout=2)
        r.ping()
        return "connected"
    except Exception as e:
        return f"error: {e}"
