import os
import redis
from dotenv import load_dotenv

load_dotenv()

REDIS_URL = os.getenv("REDIS_URL")

if not REDIS_URL:
    print("REDIS_URL is not set. Running without Redis cache.")
    redis_client = None
else:
    try:
        client = redis.from_url(
            REDIS_URL,
            decode_responses=True
        )

        client.ping()

        redis_client = client

        print("Redis connected successfully")

    except Exception as e:
        print(
            "Redis unavailable. Running without cache.",
            e
        )

        redis_client = None