from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database.connection import Base, engine
from routers import health, environments, flags, targeting_rules, audit_logs, evaluate


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create all tables on startup (idempotent)
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="Feature Flag Management API",
    version="1.0.0",
    description="API for managing feature flags across environments",
    lifespan=lifespan,
)

import os

# In production, restrict to the deployed domain via ALLOWED_ORIGINS env var.
# During development the Replit proxy sends credentialed requests from the
# same origin, so wildcard + no-credentials is safe for the dev workflow.
_raw_origins = os.environ.get("ALLOWED_ORIGINS", "")
_allowed_origins: list[str] = [o.strip() for o in _raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins if _allowed_origins else ["*"],
    allow_credentials=bool(_allowed_origins),  # only True when origins are explicit
    allow_methods=["*"],
    allow_headers=["*"],
)

# All routes mounted under /api since the proxy does NOT strip the prefix
API_PREFIX = "/api"

app.include_router(health.router, prefix=API_PREFIX, tags=["health"])
app.include_router(environments.router, prefix=API_PREFIX, tags=["environments"])
app.include_router(flags.router, prefix=API_PREFIX, tags=["flags"])
app.include_router(targeting_rules.router, prefix=API_PREFIX, tags=["targeting-rules"])
app.include_router(audit_logs.router, prefix=API_PREFIX, tags=["audit-logs"])
app.include_router(evaluate.router, prefix=API_PREFIX, tags=["evaluate"])
