from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.models.flag import Flag
from app.models.targeting_rule import TargetingRule
from app.schemas.group_targeting import (
    GroupTargetingCreate,
    GroupTargetingResponse,
)
from app.utils.cache import clear_flag_cache

router = APIRouter(
    prefix="/flags",
    tags=["Group Targeting"]
)


# ===============================
# Add Group Targeting Rule
# ===============================
@router.post(
    "/{flag_id}/targeting-groups",
    response_model=GroupTargetingResponse
)
def add_group_targeting(
    flag_id: int,
    group: GroupTargetingCreate,
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

    new_rule = TargetingRule(
        flag_id=flag_id,
        rule_type="group",
        rule_value=group.rule_value
    )

    db.add(new_rule)
    db.commit()
    db.refresh(new_rule)

    # Clear Redis cache
    clear_flag_cache(flag.flag_key)

    return new_rule


# ===============================
# Get Group Targeting Rules
# ===============================
@router.get(
    "/{flag_id}/targeting-groups",
    response_model=list[GroupTargetingResponse]
)
def get_group_targeting(
    flag_id: int,
    db: Session = Depends(get_db)
):

    return db.query(TargetingRule).filter(
        TargetingRule.flag_id == flag_id,
        TargetingRule.rule_type == "group"
    ).all()


# ===============================
# Delete Group Targeting Rule
# ===============================
@router.delete(
    "/targeting-groups/{rule_id}"
)
def delete_group_targeting(
    rule_id: int,
    db: Session = Depends(get_db)
):

    rule = db.query(TargetingRule).filter(
        TargetingRule.id == rule_id
    ).first()

    if not rule:
        raise HTTPException(
            status_code=404,
            detail="Group targeting rule not found"
        )

    flag = db.query(Flag).filter(
        Flag.id == rule.flag_id
    ).first()

    db.delete(rule)
    db.commit()

    if flag:
        clear_flag_cache(flag.flag_key)

    return {
        "message": "Group targeting rule deleted successfully"
    }