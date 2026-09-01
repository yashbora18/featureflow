import os

import redis
from dotenv import load_dotenv

load_dotenv()

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

try:
    redis_client = redis.from_url(
        REDIS_URL,
        decode_responses=True
    )

    redis_client.ping()

    print("Redis Connected Successfully")

except Exception as e:
    print("Redis Connection Failed:", e)
    redis_client = None