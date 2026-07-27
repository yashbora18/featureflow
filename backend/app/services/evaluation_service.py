from sqlalchemy.orm import Session
import hashlib
import json

from app.core.redis_client import redis_client

from app.models.flag import Flag
from app.models.flag_environment_override import FlagEnvironmentOverride
from app.models.targeting_rule import TargetingRule
from app.models.user_group_membership import UserGroupMembership


def evaluate_flag(
    flag_key: str,
    environment_id: int,
    db: Session,
    user_context=None,
):
    # ==========================================
    # Get Flag
    # ==========================================

    flag = db.query(Flag).filter(
        Flag.flag_key == flag_key
    ).first()

    # ==========================================
    # Flag Not Found
    # ==========================================

    if not flag:
        return {
            "success": False,
            "flag_key": flag_key,
            "enabled": False,
            "reason": "Flag not found"
        }

    # ==========================================
    # Flag Disabled
    # ==========================================

    if not flag.enabled:
        return {
            "success": True,
            "flag_key": flag.flag_key,
            "enabled": False,
            "reason": "Flag Disabled"
        }

    # ==========================================
    # User Context
    # ==========================================

    if user_context is None:
        user_context = {}

    evaluation_type = user_context.get("evaluation_type")
    evaluation_value = user_context.get("evaluation_value")

    user_id = (
    evaluation_value
    if evaluation_type == "user"
    else None
    )

    group_name = (
    evaluation_value
    if evaluation_type == "group"
    else None
    )

    # ==========================================
    # Redis Cache Key
    # ==========================================

    cache_key = (
    f"evaluation:{flag_key}:"
    f"{environment_id}:"
    f"{evaluation_type}:"
    f"{evaluation_value}"
)

    # ==========================================
    # Check Redis Cache
    # ==========================================

    cached_result = redis_client.get(cache_key)

    if cached_result:
        result = json.loads(cached_result)
        result["source"] = "cached"
        return result

    # ==========================================
    # User Targeting
    # ==========================================

    if evaluation_type == "user":

        user_rule = db.query(TargetingRule).filter(
            TargetingRule.flag_id == flag.id,
            TargetingRule.rule_type == "user",
            TargetingRule.rule_value == user_id
        ).first()

        if user_rule:

            result = {
                "success": True,
                "flag_key": flag.flag_key,
                "enabled": True,
                "reason": "Matched User Targeting",
                "source": "live"
            }

            redis_client.setex(
                cache_key,
                300,
                json.dumps(result)
            )

            return result

# ==========================================
# Group Targeting
# ==========================================

    if evaluation_type == "group":

        group_rule = db.query(TargetingRule).filter(
            TargetingRule.flag_id == flag.id,
            TargetingRule.rule_type == "group",
            TargetingRule.rule_value == group_name
        ).first()

        if group_rule:

            result = {
                "success": True,
                "flag_key": flag.flag_key,
                "enabled": True,
                "reason": "Matched Group Targeting",
                "source": "live"
            }

            redis_client.setex(
                cache_key,
                300,
                json.dumps(result)
            )

            return result

    # ==========================================
    # Percentage Rollout
    # ==========================================

    if user_id:

        hash_value = hashlib.sha256(
            f"{user_id}:{flag.flag_key}".encode()
        ).hexdigest()

        bucket = int(hash_value, 16) % 100

        if bucket < flag.rollout_percentage:

            result = {
                "success": True,
                "flag_key": flag.flag_key,
                "enabled": True,
                "reason": "Matched Percentage Rollout",
                "source": "live"
            }

            redis_client.setex(
                cache_key,
                300,
                json.dumps(result)
            )

            return result

    # ==========================================
    # Environment Override
    # ==========================================

    override = db.query(
        FlagEnvironmentOverride
    ).filter(
        FlagEnvironmentOverride.flag_id == flag.id,
        FlagEnvironmentOverride.environment_id == environment_id
    ).first()

    if override:

        result = {
            "success": True,
            "flag_key": flag.flag_key,
            "enabled": str(override.override_value).strip().lower() == "true",
            "reason": "Matched Environment Override",
            "source": "live"
        }

        redis_client.setex(
            cache_key,
            300,
            json.dumps(result)
        )

        return result

    # ==========================================
    # Default Value
    # ==========================================

    result = {
        "success": True,
        "flag_key": flag.flag_key,
        "enabled": str(flag.default_value).strip().lower() == "true",
        "reason": "Default Value",
        "source": "live"
    }

    redis_client.setex(
        cache_key,
        300,
        json.dumps(result)
    )

    return result