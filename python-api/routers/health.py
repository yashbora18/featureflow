from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from core.config import settings
from core.redis_client import check_redis_status
from database.connection import get_db
from schemas.health import HealthStatus

router = APIRouter()


@router.get("/healthz", response_model=HealthStatus)
def health_check(db: Session = Depends(get_db)):
    # Test DB connectivity
    try:
        db.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {e}"

    redis_status = check_redis_status()

    return HealthStatus(
        status="healthy",
        db=db_status,
        redis=redis_status,
        version=settings.VERSION,
    )
