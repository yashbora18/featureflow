from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_db

from app.models.flag import Flag
from app.models.targeting_rule import TargetingRule
from app.models.audit_log import AuditLog

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


    # ==================================
    # CREATE TARGETING RULE
    # ==================================

    targeting_rule = TargetingRule(
        flag_id=flag_id,
        rule_type="user",
        rule_value=rule.rule_value
    )

    db.add(targeting_rule)

    db.commit()

    db.refresh(targeting_rule)


    # ==================================
    # CREATE AUDIT LOG
    # ==================================

    audit_log = AuditLog(
        actor="Admin",
        flag_key=flag.flag_key,
        action="Targeting Updated",
        environment=str(flag.environment_id),
        diff=(
            f'{{'
            f'"action":"targeting_added",'
            f'"rule_type":"user",'
            f'"rule_value":"{rule.rule_value}"'
            f'}}'
        )
    )

    db.add(audit_log)

    db.commit()


    # ==================================
    # CLEAR REDIS CACHE
    # ==================================

    clear_flag_cache(
        flag.flag_key
    )


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

    return db.query(
        TargetingRule
    ).filter(

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

    rule = db.query(
        TargetingRule
    ).filter(
        TargetingRule.id == rule_id
    ).first()


    if not rule:
        raise HTTPException(
            status_code=404,
            detail="Rule not found"
        )


    # ==================================
    # FIND FLAG
    # ==================================

    flag = db.query(
        Flag
    ).filter(
        Flag.id == rule.flag_id
    ).first()


    # ==================================
    # SAVE RULE DATA
    # ==================================

    rule_type = rule.rule_type

    rule_value = rule.rule_value


    # ==================================
    # DELETE RULE
    # ==================================

    db.delete(rule)

    db.commit()


    # ==================================
    # CREATE AUDIT LOG
    # ==================================

    if flag:

        audit_log = AuditLog(
            actor="Admin",
            flag_key=flag.flag_key,
            action="Targeting Updated",
            environment=str(
                flag.environment_id
            ),
            diff=(
                f'{{'
                f'"action":"targeting_deleted",'
                f'"rule_type":"{rule_type}",'
                f'"rule_value":"{rule_value}"'
                f'}}'
            )
        )

        db.add(audit_log)

        db.commit()


        # ==================================
        # CLEAR REDIS CACHE
        # ==================================

        clear_flag_cache(
            flag.flag_key
        )


    return {
        "message":
            "Targeting rule deleted successfully"
    }