
from fastapi import APIRouter, Depends, Query

from datetime import date, timedelta

from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.dependencies import get_db

from app.models.evaluation_metric import EvaluationMetric
from app.models.flag import Flag
from app.models.targeting_rule import TargetingRule


router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


# =====================================================
# DASHBOARD ANALYTICS
# =====================================================

@router.get("/dashboard")
def get_dashboard_analytics(

    days: int = Query(7),

    environment_id: int | None = None,

    db: Session = Depends(get_db)

):

    start_date = (
        date.today()
        - timedelta(days=days)
    )


    # =================================================
    # TOTAL EVALUATIONS
    # =================================================

    total_query = (

        db.query(

            func.sum(
                EvaluationMetric.evaluation_count
            )

        )

        .filter(

            EvaluationMetric.date >= start_date

        )

    )


    if environment_id is not None:

        total_query = total_query.filter(

            EvaluationMetric.environment_id == environment_id

        )


    total_evaluations = (

        total_query.scalar()

        or 0

    )


    # =================================================
    # ACTIVE FLAGS
    # =================================================

    active_flags_query = (

        db.query(Flag)

        .filter(

            Flag.enabled == True

        )

    )


    if environment_id is not None:

        active_flags_query = active_flags_query.filter(

            Flag.environment_id == environment_id

        )


    active_flags = active_flags_query.count()


    # =================================================
    # TOTAL FLAGS
    # =================================================

    total_flags_query = db.query(Flag)


    if environment_id is not None:

        total_flags_query = total_flags_query.filter(

            Flag.environment_id == environment_id

        )


    total_flags = total_flags_query.count()


    # =================================================
    # ENVIRONMENT COUNT
    # =================================================

    environments = (

        db.query(

            Flag.environment_id

        )

        .distinct()

        .count()

    )


    # =================================================
    # ENVIRONMENT DISTRIBUTION
    # =================================================
    #
    # Always return all 3 environments.
    #
    # 1 = Development
    # 2 = Staging
    # 3 = Production
    #
    # This is intentionally NOT filtered by the
    # selected environment.
    # =================================================

    environment_distribution_query = (

        db.query(

            Flag.environment_id,

            func.count(Flag.id).label("flag_count")

        )

        .group_by(

            Flag.environment_id

        )

    )


    environment_distribution_results = (

        environment_distribution_query

        .all()

    )


    environment_flag_counts = {

        int(item.environment_id):

        int(item.flag_count)

        for item in environment_distribution_results

    }


    environment_distribution = [

        {

            "environment_id": 1,

            "name": "Development",

            "flags":
                environment_flag_counts.get(1, 0)

        },

        {

            "environment_id": 2,

            "name": "Staging",

            "flags":
                environment_flag_counts.get(2, 0)

        },

        {

            "environment_id": 3,

            "name": "Production",

            "flags":
                environment_flag_counts.get(3, 0)

        }

    ]


    # =================================================
    # FLAG LIFECYCLE
    # =================================================
    #
    # Active   = enabled flags
    # Disabled = disabled flags
    # Stale    = not updated for 30+ days
    # Total    = all flags
    #
    # Health = active flags percentage
    # =================================================

    lifecycle_flags_query = db.query(Flag)


    if environment_id is not None:

        lifecycle_flags_query = (

            lifecycle_flags_query

            .filter(

                Flag.environment_id == environment_id

            )

        )


    lifecycle_flags = (

        lifecycle_flags_query

        .all()

    )


    lifecycle_total = len(lifecycle_flags)


    lifecycle_active = sum(

        1

        for flag in lifecycle_flags

        if flag.enabled

    )


    lifecycle_disabled = (

        lifecycle_total
        -
        lifecycle_active

    )


    stale_date = (

        date.today()

        -
        timedelta(days=30)

    )


    lifecycle_stale = sum(

        1

        for flag in lifecycle_flags

        if flag.updated_at

        and flag.updated_at.date() <= stale_date

    )


    if lifecycle_total > 0:

        lifecycle_health = int(

            (
                lifecycle_active
                /
                lifecycle_total
            )
            *
            100

        )

    else:

        lifecycle_health = 0


    flag_lifecycle = {

        "active":
            lifecycle_active,

        "disabled":
            lifecycle_disabled,

        "stale":
            lifecycle_stale,

        "total":
            lifecycle_total,

        "health":
            lifecycle_health

    }


    # =================================================
    # TARGETING SUMMARY
    # =================================================
    #
    # User rules      = rule_type "user"
    # Group rules     = rule_type "group"
    # Percentage      = rollout_percentage < 100
    #
    # All rules are restricted to flags belonging
    # to the selected environment.
    # =================================================

    targeting_flags_query = db.query(Flag)


    if environment_id is not None:

        targeting_flags_query = (

            targeting_flags_query

            .filter(

                Flag.environment_id == environment_id

            )

        )


    targeting_flags = (

        targeting_flags_query

        .all()

    )


    targeting_flag_ids = [

        flag.id

        for flag in targeting_flags

    ]


    # =================================================
    # USER RULES
    # =================================================

    if targeting_flag_ids:

        user_rules = (

            db.query(TargetingRule)

            .filter(

                TargetingRule.flag_id.in_(
                    targeting_flag_ids
                )

            )

            .filter(

                TargetingRule.rule_type == "user"

            )

            .count()

        )

    else:

        user_rules = 0


    # =================================================
    # GROUP RULES
    # =================================================

    if targeting_flag_ids:

        group_rules = (

            db.query(TargetingRule)

            .filter(

                TargetingRule.flag_id.in_(
                    targeting_flag_ids
                )

            )

            .filter(

                TargetingRule.rule_type == "group"

            )

            .count()

        )

    else:

        group_rules = 0


    # =================================================
    # PERCENTAGE ROLLOUT RULES
    # =================================================

    percentage_rules = sum(

        1

        for flag in targeting_flags

        if flag.rollout_percentage < 100

    )


    # =================================================
    # TOTAL TARGETING RULES
    # =================================================

    total_rules = (

        user_rules
        +
        group_rules
        +
        percentage_rules

    )


    # =================================================
    # TARGETING COVERAGE
    # =================================================
    #
    # Number of flags with at least one targeting
    # configuration divided by total flags.
    # =================================================

    targeted_flag_ids = set()


    if targeting_flag_ids:

        targeting_rule_flags = (

            db.query(

                TargetingRule.flag_id

            )

            .filter(

                TargetingRule.flag_id.in_(
                    targeting_flag_ids
                )

            )

            .distinct()

            .all()

        )


        targeted_flag_ids.update(

            row.flag_id

            for row in targeting_rule_flags

        )


    for flag in targeting_flags:

        if flag.rollout_percentage < 100:

            targeted_flag_ids.add(

                flag.id

            )


    targeted_flags_count = len(

        targeted_flag_ids

    )


    if lifecycle_total > 0:

        targeting_coverage = int(

            (
                targeted_flags_count
                /
                lifecycle_total
            )
            *
            100

        )

    else:

        targeting_coverage = 0


    targeting_summary = {

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

    }


    # =================================================
    # TREND DATA
    # =================================================

    trend_query = (

        db.query(

            EvaluationMetric.date,

            func.sum(

                EvaluationMetric.evaluation_count

            ).label("total_count")

        )

        .filter(

            EvaluationMetric.date >= start_date

        )

    )


    if environment_id is not None:

        trend_query = trend_query.filter(

            EvaluationMetric.environment_id == environment_id

        )


    trend_data = (

        trend_query

        .group_by(

            EvaluationMetric.date

        )

        .order_by(

            EvaluationMetric.date.asc()

        )

        .all()

    )


    # =================================================
    # DEPLOYMENT SAFETY
    # =================================================

    if total_flags > 0:

        safety_score = int(

            (
                active_flags
                /
                total_flags
            )
            *
            100

        )

    else:

        safety_score = 0


    deployment_status = (

        "safe"

        if safety_score >= 80

        else "warning"

    )


    # =================================================
    # RESPONSE
    # =================================================

    return {

        # ---------------------------------------------
        # EVALUATIONS
        # ---------------------------------------------

        "totalEvaluations":
            total_evaluations,


        # ---------------------------------------------
        # ACTIVE FLAGS
        # ---------------------------------------------

        "activeFlags":
            active_flags,


        # ---------------------------------------------
        # ENVIRONMENTS
        # ---------------------------------------------

        "environments":
            environments,


        # ---------------------------------------------
        # ENVIRONMENT DISTRIBUTION
        # ---------------------------------------------

        "environmentDistribution":
            environment_distribution,


        # ---------------------------------------------
        # FLAG LIFECYCLE
        # ---------------------------------------------

        "flagLifecycle":
            flag_lifecycle,


        # ---------------------------------------------
        # TARGETING SUMMARY
        # ---------------------------------------------

        "targetingSummary":
            targeting_summary,


        # ---------------------------------------------
        # DEPLOYMENT SAFETY
        # ---------------------------------------------

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


        # ---------------------------------------------
        # EVALUATION TREND
        # ---------------------------------------------

        "trend": [

            {

                "date":
                    item.date.strftime(
                        "%Y-%m-%d"
                    ),

                "count":
                    item.total_count

            }

            for item in trend_data

        ]

    }


# =====================================================
# EVALUATION TREND ONLY
# =====================================================

@router.get("/evaluations")
def get_all_evaluations(

    days: int = Query(7),

    environment_id: int | None = None,

    db: Session = Depends(get_db)

):

    start_date = (

        date.today()

        -
        timedelta(days=days)

    )


    query = (

        db.query(

            EvaluationMetric.date,

            func.sum(

                EvaluationMetric.evaluation_count

            ).label("total_count")

        )

        .filter(

            EvaluationMetric.date >= start_date

        )

    )


    if environment_id is not None:

        query = query.filter(

            EvaluationMetric.environment_id == environment_id

        )


    metrics = (

        query

        .group_by(

            EvaluationMetric.date

        )

        .order_by(

            EvaluationMetric.date.asc()

        )

        .all()

    )


    return [

        {

            "date":

                metric.date.strftime(
                    "%Y-%m-%d"
                ),

            "count":

                metric.total_count

        }

        for metric in metrics

    ]


# =====================================================
# TOP FEATURE FLAGS
# =====================================================

@router.get("/top-flags")
def get_top_flags(

    environment_id: int | None = None,

    db: Session = Depends(get_db)

):

    query = (

        db.query(

            EvaluationMetric.flag_key,

            func.sum(

                EvaluationMetric.evaluation_count

            ).label("total_evaluations")

        )

    )


    if environment_id is not None:

        query = query.filter(

            EvaluationMetric.environment_id == environment_id

        )


    results = (

        query

        .group_by(

            EvaluationMetric.flag_key

        )

        .order_by(

            func.sum(

                EvaluationMetric.evaluation_count

            ).desc()

        )

        .limit(5)

        .all()

    )


    return [

        {

            "flag_key":

                item.flag_key,

            "evaluations":

                item.total_evaluations

        }

        for item in results

    ]


# =====================================================
# FLAG DETAIL ANALYTICS
# =====================================================

@router.get("/{flag_key}")
def get_flag_analytics(

    flag_key: str,

    environment_id: int | None = None,

    db: Session = Depends(get_db)

):

    query = (

        db.query(

            EvaluationMetric

        )

        .filter(

            EvaluationMetric.flag_key == flag_key

        )

    )


    if environment_id is not None:

        query = query.filter(

            EvaluationMetric.environment_id == environment_id

        )


    metrics = (

        query

        .order_by(

            EvaluationMetric.date.asc()

        )

        .all()

    )


    return [

        {

            "date":

                metric.date.strftime(
                    "%Y-%m-%d"
                ),

            "count":

                metric.evaluation_count

        }

        for metric in metrics

    ]
