import redis


try:

    client = redis.Redis(
        host="localhost",
        port=6379,
        db=0,
        decode_responses=True
    )


    # Check Redis connection
    client.ping()


    redis_client = client


    print("Redis connected successfully")


except Exception as e:


    print(
        "Redis unavailable. Running without cache.",
        e
    )


    redis_client = None