from app.core.redis_client import redis_client


def clear_flag_cache(flag_key):

    try:

        keys = redis_client.keys(
            f"*{flag_key}*"
        )

        for key in keys:

            redis_client.delete(key)


    except Exception as e:

        print(
            "Redis unavailable:",
            e
        )

        pass