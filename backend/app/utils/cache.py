from app.core.redis_client import redis_client


def clear_flag_cache(flag_key: str):
    pattern = f"evaluation:{flag_key}:*"

    keys = redis_client.keys(pattern)

    if keys:
        redis_client.delete(*keys)