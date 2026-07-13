from app.routers.environment import router as environment_router
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.core.database import engine

# ADD THESE TWO IMPORTS
from app.models.flag import Flag
from app.models.environment import Environment

from app.core.redis_client import redis_client
from app.routers.flags import router as flag_router

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(flag_router)
app.include_router(environment_router)


@app.get("/")
def root():
    return {"message": "Welcome to Feature Flag System"}


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.get("/db-test")
def db_test():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return {"database": "Connected successfully"}
    except Exception as e:
        return {"database": "Connection failed", "error": str(e)}


@app.get("/redis-test")
def redis_test():
    try:
        redis_client.set("message", "Redis Connected")
        value = redis_client.get("message")
        return {"redis": value}
    except Exception as e:
        return {"redis": "Connection failed", "error": str(e)}