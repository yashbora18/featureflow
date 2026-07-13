from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.flag import Flag
from app.schemas.evaluate import EvaluationRequest

router = APIRouter(
    prefix="/evaluate",
    tags=["Evaluation"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/")
def evaluate_flag(
    request: EvaluationRequest,
    db: Session = Depends(get_db)
):

    flag = db.query(Flag).filter(
        Flag.flag_key == request.flag_key
    ).first()

    if not flag:
        raise HTTPException(
            status_code=404,
            detail="Flag not found"
        )

    valid_environments = [
        "development",
        "testing",
        "staging",
        "production"
    ]

    if request.environment.lower() not in valid_environments:
        raise HTTPException(
            status_code=400,
            detail="Invalid environment"
        )

    enabled = flag.is_enabled
    reason = "Flag value from database"

    if request.environment.lower() == "production":
        enabled = False
        reason = "Production override applied"

    elif enabled:
        reason = "Flag is enabled"

    else:
        reason = "Flag is disabled"

    return {
        "status": "Evaluation Successful",
        "flag_key": flag.flag_key,
        "environment": request.environment,
        "user": request.user,
        "enabled": enabled,
        "reason": reason
    }