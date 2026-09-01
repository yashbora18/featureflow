import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.core.database import engine, Base
from app.core.redis_client import redis_client


from app.models.flag import Flag
from app.models.environment import Environment
from app.models.flag_environment_override import FlagEnvironmentOverride
from app.models.evaluation_metric import EvaluationMetric
from app.models.user import User
from app.models.cleanup_review import CleanupReview


from app.routers import dashboard
from app.routers.flags import router as flag_router
from app.routers.auth import router as auth_router
from app.routers.cleanup import router as cleanup_router
from app.routers.environment import router as environment_router
from app.routers.flag_environment_override import (
    router as flag_override_router,
)
from app.routers.evaluate import router as evaluate_router
from app.routers.analytics import router as analytics_router
from app.routers.targeting_rule import (
    router as targeting_rule_router,
)
from app.routers.group_targeting import (
    router as group_targeting_router,
)
from app.routers import audit_logs

app = FastAPI()

# Create database tables
Base.metadata.create_all(bind=engine)

# CORS
FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "http://localhost:5173"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://featureflow-frontend-kappa.vercel.app",
    FRONTEND_URL,
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(flag_router)
app.include_router(environment_router)
app.include_router(flag_override_router)
app.include_router(evaluate_router)
app.include_router(analytics_router)
app.include_router(targeting_rule_router)
app.include_router(group_targeting_router)
app.include_router(auth_router)
app.include_router(audit_logs.router)
app.include_router(cleanup_router)
app.include_router(dashboard.router)


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
        return {
            "database": "Connection failed",
            "error": str(e),
        }


@app.get("/redis-test")
def redis_test():
    try:
        redis_client.set("message", "Redis Connected")
        value = redis_client.get("message")
        return {"redis": value}
    except Exception as e:
        return {
            "redis": "Connection failed",
            "error": str(e),
        }


@app.get("/redis-keys")
def redis_keys():
    keys = redis_client.keys("*")

    data = {}

    for key in keys:
        data[key] = redis_client.get(key)

    return data