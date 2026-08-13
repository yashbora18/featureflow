from datetime import date, datetime, timezone
import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_db

from app.models.flag import Flag
from app.models.environment import Environment
from app.models.evaluation_metric import EvaluationMetric
from app.models.audit_log import AuditLog

from app.schemas.flag import FlagCreate, FlagResponse

from app.services.evaluation_service import evaluate_flag

from app.utils.cache import clear_flag_cache


router = APIRouter(
    prefix="/flags",
    tags=["Flags"]
)


# =====================================================
# CREATE FEATURE FLAG
# =====================================================

@router.post(
    "/",
    response_model=FlagResponse
)
def create_flag(
    flag: FlagCreate,
    db: Session = Depends(get_db)
):

    # ---------------------------------------------
    # CHECK DUPLICATE FLAG
    # ---------------------------------------------

    existing_flag = db.query(Flag).filter(
        Flag.flag_key == flag.flag_key,
        Flag.environment_id == flag.environment_id
    ).first()

    if existing_flag:

        raise HTTPException(
            status_code=409,
            detail="Flag already exists in this environment"
        )


    # ---------------------------------------------
    # CHECK ENVIRONMENT
    # ---------------------------------------------

    environment = db.query(Environment).filter(
        Environment.id == flag.environment_id
    ).first()

    if not environment:

        raise HTTPException(
            status_code=404,
            detail="Invalid environment"
        )


    # ---------------------------------------------
    # CREATE FLAG
    # ---------------------------------------------

    new_flag = Flag(

        flag_key=flag.flag_key,

        flag_type=flag.flag_type,

        default_value=flag.default_value,

        enabled=flag.enabled,

        rollout_percentage=flag.rollout_percentage,

        description=flag.description,

        owner_team=flag.owner_team,

        environment_id=flag.environment_id

    )


    db.add(new_flag)

    db.commit()

    db.refresh(new_flag)


    # ---------------------------------------------
    # CREATE AUDIT LOG
    # ---------------------------------------------

    audit_log = AuditLog(

        actor="Admin",

        flag_key=new_flag.flag_key,

        action="Created",

        environment=environment.name,

        timestamp=datetime.now(
            timezone.utc
        ).strftime(
            "%Y-%m-%d %H:%M:%S"
        ),

        diff=json.dumps({

            "action":
                "created",

            "flag_key":
                new_flag.flag_key,

            "enabled":
                new_flag.enabled,

            "rollout_percentage":
                new_flag.rollout_percentage,

            "environment_id":
                new_flag.environment_id

        })

    )


    db.add(audit_log)

    db.commit()


    # ---------------------------------------------
    # CLEAR CACHE
    # ---------------------------------------------

    clear_flag_cache(
        new_flag.flag_key
    )


    return new_flag


# =====================================================
# GET FLAGS BY ENVIRONMENT
# =====================================================

@router.get(
    "/",
    response_model=list[FlagResponse]
)
def get_flags(

    environment_id: int | None = None,

    db: Session = Depends(get_db)

):

    query = db.query(Flag)


    if environment_id is not None:

        query = query.filter(
            Flag.environment_id == environment_id
        )


    return query.all()


# =====================================================
# EVALUATE FEATURE FLAG
#
# IMPORTANT:
# This route MUST come before /{key}
# =====================================================

@router.get("/evaluate/")
def evaluate(

    flag_key: str,

    environment_id: int,

    user_id: str | None = None,

    db: Session = Depends(get_db)

):

    # ---------------------------------------------
    # EVALUATE FLAG
    # ---------------------------------------------

    result = evaluate_flag(

        flag_key=flag_key,

        environment_id=environment_id,

        db=db,

        user_context={

            "user_id": user_id

        }

        if user_id

        else {}

    )


    # ---------------------------------------------
    # RECORD EVALUATION METRIC
    # ---------------------------------------------

    today = date.today()


    metric = db.query(
        EvaluationMetric
    ).filter(

        EvaluationMetric.flag_key == flag_key,

        EvaluationMetric.environment_id ==
            environment_id,

        EvaluationMetric.date == today

    ).first()


    if metric:

        metric.evaluation_count += 1


    else:

        metric = EvaluationMetric(

            flag_key=flag_key,

            environment_id=environment_id,

            date=today,

            evaluation_count=1

        )

        db.add(metric)


    db.commit()


    return result


# =====================================================
# GET SINGLE FLAG BY KEY + ENVIRONMENT
# =====================================================

@router.get(
    "/{key}",
    response_model=FlagResponse
)
def get_flag(

    key: str,

    environment_id: int,

    db: Session = Depends(get_db)

):

    flag = db.query(Flag).filter(

        Flag.flag_key == key,

        Flag.environment_id == environment_id

    ).first()


    if not flag:

        raise HTTPException(

            status_code=404,

            detail="Flag not found"

        )


    return flag


# =====================================================
# UPDATE FEATURE FLAG
# =====================================================

@router.put(
    "/{key}",
    response_model=FlagResponse
)
def update_flag(

    key: str,

    environment_id: int,

    updated_flag: FlagCreate,

    db: Session = Depends(get_db)

):

    # ---------------------------------------------
    # FIND FLAG
    # ---------------------------------------------

    flag = db.query(Flag).filter(

        Flag.flag_key == key,

        Flag.environment_id == environment_id

    ).first()


    if not flag:

        raise HTTPException(

            status_code=404,

            detail="Flag not found"

        )


    # ---------------------------------------------
    # CHECK NEW ENVIRONMENT
    # ---------------------------------------------

    environment = db.query(Environment).filter(

        Environment.id ==
            updated_flag.environment_id

    ).first()


    if not environment:

        raise HTTPException(

            status_code=404,

            detail="Invalid environment"

        )


    # ---------------------------------------------
    # SAVE OLD VALUES
    # ---------------------------------------------

    old_enabled = flag.enabled

    old_rollout = flag.rollout_percentage

    old_environment_id = flag.environment_id


    old_data = {

        "flag_key":
            flag.flag_key,

        "enabled":
            flag.enabled,

        "rollout_percentage":
            flag.rollout_percentage,

        "environment_id":
            flag.environment_id

    }


    # ---------------------------------------------
    # UPDATE FLAG
    # ---------------------------------------------

    flag.flag_key = updated_flag.flag_key

    flag.flag_type = updated_flag.flag_type

    flag.default_value = updated_flag.default_value

    flag.enabled = updated_flag.enabled

    flag.rollout_percentage = (
        updated_flag.rollout_percentage
    )

    flag.description = updated_flag.description

    flag.owner_team = updated_flag.owner_team

    flag.environment_id = updated_flag.environment_id


    db.commit()

    db.refresh(flag)


    # ---------------------------------------------
    # DETERMINE AUDIT ACTION
    # ---------------------------------------------

    action = "Updated"


    if old_enabled != flag.enabled:

        if flag.enabled:

            action = "Enabled"

        else:

            action = "Disabled"


    elif old_rollout != flag.rollout_percentage:

        action = "Rollout Changed"


    elif old_environment_id != flag.environment_id:

        action = "Environment Changed"


    # ---------------------------------------------
    # NEW VALUES
    # ---------------------------------------------

    new_data = {

        "flag_key":
            flag.flag_key,

        "enabled":
            flag.enabled,

        "rollout_percentage":
            flag.rollout_percentage,

        "environment_id":
            flag.environment_id

    }


    # ---------------------------------------------
    # CREATE AUDIT LOG
    # ---------------------------------------------

    audit_log = AuditLog(

        actor="Admin",

        flag_key=flag.flag_key,

        action=action,

        environment=environment.name,

        timestamp=datetime.now(
            timezone.utc
        ).strftime(
            "%Y-%m-%d %H:%M:%S"
        ),

        diff=json.dumps({

            "before":
                old_data,

            "after":
                new_data

        })

    )


    db.add(audit_log)

    db.commit()


    # ---------------------------------------------
    # CLEAR CACHE
    # ---------------------------------------------

    clear_flag_cache(
        flag.flag_key
    )


    return flag


# =====================================================
# DELETE FEATURE FLAG
# =====================================================

@router.delete(
    "/{key}"
)
def delete_flag(

    key: str,

    environment_id: int,

    db: Session = Depends(get_db)

):

    # ---------------------------------------------
    # FIND FLAG
    # ---------------------------------------------

    flag = db.query(Flag).filter(

        Flag.flag_key == key,

        Flag.environment_id == environment_id

    ).first()


    if not flag:

        raise HTTPException(

            status_code=404,

            detail="Flag not found"

        )


    # ---------------------------------------------
    # FIND ENVIRONMENT
    # ---------------------------------------------

    environment = db.query(Environment).filter(

        Environment.id ==
            flag.environment_id

    ).first()


    # ---------------------------------------------
    # SAVE FLAG DATA BEFORE DELETE
    # ---------------------------------------------

    old_data = {

        "flag_key":
            flag.flag_key,

        "enabled":
            flag.enabled,

        "rollout_percentage":
            flag.rollout_percentage,

        "environment_id":
            flag.environment_id

    }


    # ---------------------------------------------
    # CREATE DELETE AUDIT LOG
    # ---------------------------------------------

    audit_log = AuditLog(

        actor="Admin",

        flag_key=flag.flag_key,

        action="Deleted",

        environment=(

            environment.name

            if environment

            else "Unknown"

        ),

        timestamp=datetime.now(
            timezone.utc
        ).strftime(
            "%Y-%m-%d %H:%M:%S"
        ),

        diff=json.dumps(
            old_data
        )

    )


    db.add(audit_log)


    # ---------------------------------------------
    # DELETE FLAG
    # ---------------------------------------------

    db.delete(flag)

    db.commit()


    # ---------------------------------------------
    # CLEAR CACHE
    # ---------------------------------------------

    clear_flag_cache(
        key
    )


    return {

        "message":
            f"Flag '{key}' deleted successfully"

    }