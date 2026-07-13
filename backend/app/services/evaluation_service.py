from sqlalchemy.orm import Session
from app.models.flag import Flag


def evaluate_flag(flag_key: str, environment_id: int, db: Session, user_context=None):
    flag = db.query(Flag).filter(
        Flag.flag_key == flag_key,
        Flag.environment_id == environment_id
    ).first()

    # Case 1: Flag not found
    if not flag:
        return {
            "success": False,
            "message": "Flag not found"
        }

    # Case 2: Flag is disabled
    if not flag.enabled:
        return {
            "success": True,
            "flag_key": flag.flag_key,
            "enabled": False,
            "default_value": False
            if flag.flag_type == "boolean"
            else flag.default_value
        }

    # Case 3: Empty user context
    if user_context is None:
        user_context = {}

    # Case 4: Environment override
    # (Placeholder for Milestone 2)

    return {
        "success": True,
        "flag_key": flag.flag_key,
        "enabled": flag.enabled,
        "default_value": flag.default_value
    }