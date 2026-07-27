from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_db

from app.schemas.evaluate import (
    EvaluateRequest,
    EvaluateResponse,
)

from app.services.evaluation_service import evaluate_flag

router = APIRouter(
    prefix="/evaluate",
    tags=["Evaluation"]
)


@router.post(
    "/",
    response_model=EvaluateResponse
)
def evaluate(
    request: EvaluateRequest,
    db: Session = Depends(get_db)
):

    result = evaluate_flag(
    flag_key=request.flag_key,
    environment_id=request.environment_id,
    db=db,
    user_context={
        "evaluation_type": request.evaluation_type,
        "evaluation_value": request.evaluation_value,
    }
)

    return {
        "flag_key": result["flag_key"],
        "enabled": result["enabled"],
        "reason": result["reason"],
    }