from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.connection import get_db
from schemas.evaluate import EvaluateRequest, EvaluateResponse
from engines.evaluate import evaluate_flag

router = APIRouter()


@router.post("/evaluate", response_model=EvaluateResponse)
def evaluate(body: EvaluateRequest, db: Session = Depends(get_db)):
    """
    Evaluate a feature flag for a given environment.

    ``environment`` may be an exact slug (preferred, always unambiguous) or a
    display name.  If the display name matches more than one environment a 400
    is returned so callers know to use the slug instead.

    Returns the resolved boolean ``enabled`` value along with an evaluation
    ``reason`` so callers can distinguish "disabled" from "not found".
    """
    try:
        result = evaluate_flag(
            flag_key=body.flag_key,
            environment_name=body.environment,
            db=db,
            user_context=body.user_context,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    return EvaluateResponse(
        enabled=result.enabled,
        flag_key=result.flag_key,
        environment=result.environment,
        reason=result.reason,
    )
