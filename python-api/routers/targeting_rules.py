import json
from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from database.connection import get_db
from models.audit_log import AuditLog
from models.targeting_rule import TargetingRule
from schemas.targeting_rule import TargetingRuleInput, TargetingRuleResponse, TargetingRuleUpdate

router = APIRouter()


def _log_audit(db: Session, entity_id: int, entity_name: str, action: str, environment_id: int = None):
    entry = AuditLog(
        entity_type="targeting_rule",
        entity_id=entity_id,
        entity_name=entity_name,
        action=action,
        environment_id=environment_id,
    )
    db.add(entry)


@router.get("/targeting-rules", response_model=List[TargetingRuleResponse])
def list_targeting_rules(
    flag_id: Optional[int] = Query(None),
    environment_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(TargetingRule)
    if flag_id is not None:
        q = q.filter(TargetingRule.flag_id == flag_id)
    if environment_id is not None:
        q = q.filter(TargetingRule.environment_id == environment_id)
    return q.order_by(TargetingRule.priority.asc(), TargetingRule.id.asc()).all()


@router.post("/targeting-rules", response_model=TargetingRuleResponse, status_code=201)
def create_targeting_rule(body: TargetingRuleInput, db: Session = Depends(get_db)):
    rule = TargetingRule(
        flag_id=body.flag_id,
        environment_id=body.environment_id,
        name=body.name,
        conditions=body.conditions,
        rollout_percentage=body.rollout_percentage,
        enabled=body.enabled,
        priority=body.priority,
    )
    db.add(rule)
    db.commit()
    db.refresh(rule)
    _log_audit(db, rule.id, rule.name, "created", environment_id=rule.environment_id)
    db.commit()
    return rule


@router.put("/targeting-rules/{id}", response_model=TargetingRuleResponse)
def update_targeting_rule(id: int, body: TargetingRuleUpdate, db: Session = Depends(get_db)):
    rule = db.query(TargetingRule).filter(TargetingRule.id == id).first()
    if not rule:
        raise HTTPException(status_code=404, detail="Targeting rule not found")

    if body.name is not None:
        rule.name = body.name
    if body.conditions is not None:
        rule.conditions = body.conditions
    if body.rollout_percentage is not None:
        rule.rollout_percentage = body.rollout_percentage
    if body.enabled is not None:
        rule.enabled = body.enabled
    if body.priority is not None:
        rule.priority = body.priority

    rule.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(rule)
    _log_audit(db, rule.id, rule.name, "updated", environment_id=rule.environment_id)
    db.commit()
    return rule


@router.delete("/targeting-rules/{id}", status_code=204)
def delete_targeting_rule(id: int, db: Session = Depends(get_db)):
    rule = db.query(TargetingRule).filter(TargetingRule.id == id).first()
    if not rule:
        raise HTTPException(status_code=404, detail="Targeting rule not found")
    _log_audit(db, rule.id, rule.name, "deleted", environment_id=rule.environment_id)
    db.delete(rule)
    db.commit()
