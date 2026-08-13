from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, text

from app.core.database import get_db
from app.core.redis_client import redis_client

from app.models.flag import Flag
from app.models.environment import Environment
from app.models.evaluation_metric import EvaluationMetric
from app.models.targeting_rule import TargetingRule


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)



@router.get("")
def get_dashboard(
    db: Session = Depends(get_db)
):


    flags = db.query(Flag).all()


    environments = db.query(Environment).all()





    # ==========================
    # Evaluations
    # ==========================

    evaluations = db.query(
        func.sum(
            EvaluationMetric.evaluation_count
        )
    ).scalar() or 0







    # ==========================
    # Flag Statistics
    # ==========================

    total_flags = len(flags)



    active_flags = len(
        [
            flag
            for flag in flags
            if flag.enabled
        ]
    )



    disabled_flags = len(
        [
            flag
            for flag in flags
            if not flag.enabled
        ]
    )



    stale_flags = len(
        [
            flag
            for flag in flags
            if getattr(
                flag,
                "rollout_percentage",
                0
            ) == 0
        ]
    )



    lifecycle_health = (

        0

        if total_flags == 0

        else round(
            (active_flags / total_flags) * 100
        )

    )









    # ==========================
    # Deployment Safety
    # ==========================


    safety_score = (

        100

        if total_flags == 0

        else round(
            (active_flags / total_flags) * 100
        )

    )



    deployment_status = (

        "safe"

        if safety_score >= 80

        else "warning"

    )









    # ==========================
    # Targeting Summary
    # ==========================


    targeting_rules = db.query(
        TargetingRule
    ).all()



    user_rules = len(
        [
            rule
            for rule in targeting_rules
            if rule.rule_type == "user"
        ]
    )



    group_rules = len(
        [
            rule
            for rule in targeting_rules
            if rule.rule_type == "group"
        ]
    )



    percentage_rules = len(
        [
            rule
            for rule in targeting_rules
            if rule.rule_type == "percentage"
        ]
    )



    total_rules = len(
        targeting_rules
    )



    targeting_coverage = (

        100

        if total_rules > 0

        else 0

    )









    # ==========================
    # Database Health
    # ==========================


    try:

        db.execute(
            text("SELECT 1")
        )


        database_status = (
            "Connected successfully"
        )


    except Exception:

        database_status = (
            "Connection failed"
        )









    # ==========================
    # Redis Health
    # ==========================


    try:

        redis_client.ping()


        redis_status = (
            "Redis Connected"
        )


    except Exception:


        redis_status = (
            "Redis Connection Failed"
        )









    return {


        "flags": [

            {
                "id": flag.id,

                "key": flag.flag_key,

                "enabled": flag.enabled

            }

            for flag in flags

        ],





        "environments": [

            {
                "id": env.id,

                "name": env.name

            }

            for env in environments

        ],






        "evaluations":
        evaluations,







        "deploymentSafety": {


            "score":
            safety_score,


            "activeFlags":
            active_flags,


            "totalFlags":
            total_flags,


            "status":
            deployment_status


        },







        "flagLifecycle": {


            "active":
            active_flags,


            "disabled":
            disabled_flags,


            "stale":
            stale_flags,


            "total":
            total_flags,


            "health":
            lifecycle_health


        },








        "targetingSummary": {


            "userRules":
            user_rules,


            "groupRules":
            group_rules,


            "percentageRules":
            percentage_rules,


            "totalRules":
            total_rules,


            "coverage":
            targeting_coverage


        },








        "health": {


            "status":
            "healthy"


        },








        "database": {


            "database":
            database_status


        },








        "redis": {


            "redis":
            redis_status


        }


    }