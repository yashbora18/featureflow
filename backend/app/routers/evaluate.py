from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date

from app.core.redis_client import redis_client
from app.core.dependencies import get_db

from app.schemas.evaluate import (
    EvaluateRequest,
    EvaluateResponse,
)

from app.services.evaluation_service import evaluate_flag

from app.models.evaluation_metric import EvaluationMetric


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

    # =====================================================
    # EVALUATE FEATURE FLAG
    # =====================================================

    result = evaluate_flag(
        flag_key=request.flag_key,
        environment_id=request.environment_id,
        db=db,
        user_context={
            "evaluation_type": request.evaluation_type,
            "evaluation_value": request.evaluation_value,
        }
    )


    # =====================================================
    # SAVE EVALUATION METRIC
    # =====================================================

    today = date.today()


    metric = db.query(
        EvaluationMetric
    ).filter(
        EvaluationMetric.flag_key == request.flag_key,
        EvaluationMetric.environment_id == request.environment_id,
        EvaluationMetric.date == today
    ).first()


    if metric:

        metric.evaluation_count += 1


    else:

        metric = EvaluationMetric(

            flag_key=request.flag_key,

            environment_id=request.environment_id,

            date=today,

            evaluation_count=1

        )

        db.add(metric)


    db.commit()


    # =====================================================
    # REDIS COUNTER
    # =====================================================

    redis_key = (
        f"feature_eval:"
        f"{request.flag_key}:"
        f"{request.environment_id}"
    )

    redis_client.incr(redis_key)


    # =====================================================
    # RESPONSE
    # =====================================================

    return {

        "flag_key": result["flag_key"],

        "enabled": result["enabled"],

        "reason": result["reason"],

    }