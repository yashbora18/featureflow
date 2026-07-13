from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.health import router
from app.routers.flags import router as flags_router
from app.routers.evaluate import router as evaluate_router

from app.core.database import engine, Base

from app.models.environment import Environment
from app.models.flag import Flag
from app.models.flag_version import FlagVersion
from app.models.targeting_rule import TargetingRule
from app.models.user_group_membership import UserGroupMembership
from app.models.audit_log import AuditLog
from app.core.redis import redis_client

app = FastAPI(title="Feature Flag API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5174",
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("Database Connected Successfully")

Base.metadata.create_all(bind=engine)

app.include_router(router)
app.include_router(flags_router)
app.include_router(evaluate_router)


@app.get("/")
def home():
    return {
        "message": "Feature Flag Backend Running"
    }