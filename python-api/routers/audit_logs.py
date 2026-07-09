from typing import List, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from database.connection import get_db
from models.audit_log import AuditLog
from models.environment import Environment
from schemas.audit_log import AuditLogList, AuditLogResponse

router = APIRouter()


@router.get("/audit-logs", response_model=AuditLogList)
def list_audit_logs(
    environment_id: Optional[int] = Query(None),
    flag_id: Optional[int] = Query(None),
    action: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    q = db.query(AuditLog)
    if environment_id is not None:
        q = q.filter(AuditLog.environment_id == environment_id)
    if flag_id is not None:
        q = q.filter(AuditLog.entity_type == "flag", AuditLog.entity_id == flag_id)
    if action is not None:
        q = q.filter(AuditLog.action == action)

    total = q.count()
    entries = (
        q.order_by(AuditLog.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )

    # Enrich with environment_name
    env_cache = {}
    items = []
    for entry in entries:
        env_name = None
        if entry.environment_id:
            if entry.environment_id not in env_cache:
                env = db.query(Environment).filter(Environment.id == entry.environment_id).first()
                env_cache[entry.environment_id] = env.name if env else None
            env_name = env_cache[entry.environment_id]

        items.append(
            AuditLogResponse(
                id=entry.id,
                entity_type=entry.entity_type,
                entity_id=entry.entity_id,
                entity_name=entry.entity_name,
                action=entry.action,
                user_id=entry.user_id,
                changes=entry.changes,
                environment_id=entry.environment_id,
                environment_name=env_name,
                created_at=entry.created_at,
            )
        )

    return AuditLogList(items=items, total=total, limit=limit, offset=offset)
