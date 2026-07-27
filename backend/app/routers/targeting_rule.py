from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.models.flag import Flag
from app.models.targeting_rule import TargetingRule
from app.schemas.targeting_rule import (
    TargetingRuleCreate,
    TargetingRuleResponse,
)
from app.utils.cache import clear_flag_cache

router = APIRouter(
    prefix="/flags",
    tags=["Targeting Rules"]
)


# ==================================
# Add User Targeting Rule
# ==================================

@router.post(
    "/{flag_id}/targeting-users",
    response_model=TargetingRuleResponse
)
def add_targeting_rule(
    flag_id: int,
    rule: TargetingRuleCreate,
    db: Session = Depends(get_db)
):

    flag = db.query(Flag).filter(
        Flag.id == flag_id
    ).first()

    if not flag:
        raise HTTPException(
            status_code=404,
            detail="Flag not found"
        )

    targeting_rule = TargetingRule(
        flag_id=flag_id,
        rule_type="user",
        rule_value=rule.rule_value
    )

    db.add(targeting_rule)
    db.commit()
    db.refresh(targeting_rule)

    # Clear Redis cache
    clear_flag_cache(flag.flag_key)

    return targeting_rule


# ==================================
# Get User Targeting Rules
# ==================================

@router.get(
    "/{flag_id}/targeting-users",
    response_model=list[TargetingRuleResponse]
)
def get_targeting_rules(
    flag_id: int,
    db: Session = Depends(get_db)
):

    return db.query(TargetingRule).filter(
        TargetingRule.flag_id == flag_id,
        TargetingRule.rule_type == "user"
    ).all()


# ==================================
# Delete User Targeting Rule
# ==================================

@router.delete(
    "/targeting-users/{rule_id}"
)
def delete_targeting_rule(
    rule_id: int,
    db: Session = Depends(get_db)
):

    rule = db.query(TargetingRule).filter(
        TargetingRule.id == rule_id
    ).first()

    if not rule:
        raise HTTPException(
            status_code=404,
            detail="Rule not found"
        )

    flag = db.query(Flag).filter(
        Flag.id == rule.flag_id
    ).first()

    db.delete(rule)
    db.commit()

    if flag:
        clear_flag_cache(flag.flag_key)

    return {
        "message": "Targeting rule deleted successfully"
    }