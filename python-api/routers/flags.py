import json
from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from database.connection import get_db
from models.audit_log import AuditLog
from models.environment import Environment
from models.flag import Flag
from models.flag_version import FlagVersion
from models.targeting_rule import TargetingRule
from schemas.flag import FlagInput, FlagResponse, FlagsSummary, FlagUpdate, FlagVersionResponse

router = APIRouter()


def _flag_to_response(flag: Flag, db: Session) -> FlagResponse:
    env = db.query(Environment).filter(Environment.id == flag.environment_id).first()
    targeting_count = (
        db.query(func.count(TargetingRule.id))
        .filter(TargetingRule.flag_id == flag.id)
        .scalar()
        or 0
    )
    return FlagResponse(
        id=flag.id,
        key=flag.key,
        name=flag.name,
        description=flag.description,
        enabled=flag.enabled,
        flag_type=flag.flag_type,
        default_value=flag.default_value,
        owner=flag.owner,
        environment_id=flag.environment_id,
        environment_name=env.name if env else "Unknown",
        targeting_rules_count=targeting_count,
        version=flag.version,
        created_at=flag.created_at,
        updated_at=flag.updated_at,
    )


def _log_audit(
    db: Session,
    entity_type: str,
    entity_id: int,
    entity_name: str,
    action: str,
    environment_id: int = None,
    changes: dict = None,
):
    entry = AuditLog(
        entity_type=entity_type,
        entity_id=entity_id,
        entity_name=entity_name,
        action=action,
        environment_id=environment_id,
        changes=json.dumps(changes) if changes else None,
    )
    db.add(entry)


def _snapshot_version(db: Session, flag: Flag):
    """Save current state as a version snapshot."""
    version = FlagVersion(
        flag_id=flag.id,
        version=flag.version,
        enabled=flag.enabled,
        default_value=flag.default_value,
    )
    db.add(version)


@router.get("/flags/summary", response_model=FlagsSummary)
def get_flags_summary(
    environment_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(Flag)
    if environment_id is not None:
        q = q.filter(Flag.environment_id == environment_id)

    total_flags = q.count()
    enabled_flags = q.filter(Flag.enabled == True).count()
    disabled_flags = total_flags - enabled_flags
    total_environments = db.query(func.count(Environment.id)).scalar() or 0

    # Flags by type
    type_counts = (
        db.query(Flag.flag_type, func.count(Flag.id))
        .group_by(Flag.flag_type)
        .all()
    )
    flags_by_type = {t: c for t, c in type_counts}

    # Recent changes in last 24h
    from datetime import timedelta
    recent_changes = (
        db.query(func.count(AuditLog.id))
        .filter(AuditLog.created_at >= datetime.utcnow() - timedelta(hours=24))
        .scalar()
        or 0
    )

    targeting_rules_count = db.query(func.count(TargetingRule.id)).scalar() or 0

    return FlagsSummary(
        total_flags=total_flags,
        enabled_flags=enabled_flags,
        disabled_flags=disabled_flags,
        total_environments=total_environments,
        flags_by_type=flags_by_type,
        recent_changes=recent_changes,
        targeting_rules_count=targeting_rules_count,
    )


@router.get("/flags", response_model=List[FlagResponse])
def list_flags(
    environment_id: Optional[int] = Query(None),
    search: Optional[str] = Query(None),
    enabled: Optional[bool] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(Flag)
    if environment_id is not None:
        q = q.filter(Flag.environment_id == environment_id)
    if search:
        q = q.filter(
            (Flag.key.ilike(f"%{search}%")) | (Flag.name.ilike(f"%{search}%"))
        )
    if enabled is not None:
        q = q.filter(Flag.enabled == enabled)
    flags = q.order_by(Flag.id.desc()).all()
    return [_flag_to_response(f, db) for f in flags]


@router.post("/flags", response_model=FlagResponse, status_code=201)
def create_flag(body: FlagInput, db: Session = Depends(get_db)):
    # Verify environment exists
    env = db.query(Environment).filter(Environment.id == body.environment_id).first()
    if not env:
        raise HTTPException(status_code=404, detail="Environment not found")

    flag = Flag(
        key=body.key,
        name=body.name,
        description=body.description,
        flag_type=body.flag_type or "boolean",
        default_value=body.default_value,
        environment_id=body.environment_id,
        owner=body.owner,
        enabled=body.enabled if body.enabled is not None else False,
        version=1,
    )
    db.add(flag)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail=f"A flag with key '{body.key}' already exists in this environment")
    db.refresh(flag)
    _snapshot_version(db, flag)
    _log_audit(db, "flag", flag.id, flag.key, "created", environment_id=flag.environment_id)
    db.commit()
    return _flag_to_response(flag, db)


@router.get("/flags/{id}", response_model=FlagResponse)
def get_flag(id: int, db: Session = Depends(get_db)):
    flag = db.query(Flag).filter(Flag.id == id).first()
    if not flag:
        raise HTTPException(status_code=404, detail="Flag not found")
    return _flag_to_response(flag, db)


@router.put("/flags/{id}", response_model=FlagResponse)
def update_flag(id: int, body: FlagUpdate, db: Session = Depends(get_db)):
    flag = db.query(Flag).filter(Flag.id == id).first()
    if not flag:
        raise HTTPException(status_code=404, detail="Flag not found")

    changes = {}
    if body.name is not None:
        changes["name"] = {"from": flag.name, "to": body.name}
        flag.name = body.name
    if body.description is not None:
        flag.description = body.description
    if body.flag_type is not None:
        flag.flag_type = body.flag_type
    if body.default_value is not None:
        flag.default_value = body.default_value
    if body.enabled is not None:
        changes["enabled"] = {"from": flag.enabled, "to": body.enabled}
        flag.enabled = body.enabled
    if body.owner is not None:
        flag.owner = body.owner

    flag.version += 1
    flag.updated_at = datetime.utcnow()
    _snapshot_version(db, flag)
    db.commit()
    db.refresh(flag)
    _log_audit(db, "flag", flag.id, flag.key, "updated", environment_id=flag.environment_id, changes=changes)
    db.commit()
    return _flag_to_response(flag, db)


@router.delete("/flags/{id}", status_code=204)
def delete_flag(id: int, db: Session = Depends(get_db)):
    flag = db.query(Flag).filter(Flag.id == id).first()
    if not flag:
        raise HTTPException(status_code=404, detail="Flag not found")
    _log_audit(db, "flag", flag.id, flag.key, "deleted", environment_id=flag.environment_id)
    db.delete(flag)
    db.commit()


@router.patch("/flags/{id}/toggle", response_model=FlagResponse)
def toggle_flag(id: int, db: Session = Depends(get_db)):
    flag = db.query(Flag).filter(Flag.id == id).first()
    if not flag:
        raise HTTPException(status_code=404, detail="Flag not found")

    old_state = flag.enabled
    flag.enabled = not flag.enabled
    flag.version += 1
    flag.updated_at = datetime.utcnow()
    _snapshot_version(db, flag)
    db.commit()
    db.refresh(flag)
    _log_audit(
        db,
        "flag",
        flag.id,
        flag.key,
        "toggled",
        environment_id=flag.environment_id,
        changes={"enabled": {"from": old_state, "to": flag.enabled}},
    )
    db.commit()
    return _flag_to_response(flag, db)


def _resolve_flag_by_key(key: str, environment_id: Optional[int], db: Session) -> Flag:
    """Resolve a flag by key, raising clear errors on ambiguity or not-found."""
    q = db.query(Flag).filter(Flag.key == key)
    if environment_id is not None:
        q = q.filter(Flag.environment_id == environment_id)

    flags = q.all()
    if not flags:
        raise HTTPException(status_code=404, detail=f"Flag '{key}' not found")
    if len(flags) > 1:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Key '{key}' exists in {len(flags)} environments. "
                "Provide ?environment_id=<id> to disambiguate."
            ),
        )
    return flags[0]


@router.get("/flags/by-key/{key}", response_model=FlagResponse)
def get_flag_by_key(
    key: str,
    environment_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    """Get a flag by its string key, scoped to an environment when provided."""
    flag = _resolve_flag_by_key(key, environment_id, db)
    return _flag_to_response(flag, db)


@router.put("/flags/by-key/{key}", response_model=FlagResponse)
def update_flag_by_key(
    key: str,
    body: FlagUpdate,
    environment_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    """Update a flag by its string key, scoped to an environment when provided."""
    flag = _resolve_flag_by_key(key, environment_id, db)
    if not flag:
        raise HTTPException(status_code=404, detail=f"Flag '{key}' not found")

    changes = {}
    if body.name is not None:
        changes["name"] = {"from": flag.name, "to": body.name}
        flag.name = body.name
    if body.description is not None:
        flag.description = body.description
    if body.flag_type is not None:
        flag.flag_type = body.flag_type
    if body.default_value is not None:
        flag.default_value = body.default_value
    if body.enabled is not None:
        changes["enabled"] = {"from": flag.enabled, "to": body.enabled}
        flag.enabled = body.enabled
    if body.owner is not None:
        flag.owner = body.owner

    flag.version += 1
    flag.updated_at = datetime.utcnow()
    _snapshot_version(db, flag)
    db.commit()
    db.refresh(flag)
    _log_audit(db, "flag", flag.id, flag.key, "updated", environment_id=flag.environment_id, changes=changes)
    db.commit()
    return _flag_to_response(flag, db)


@router.get("/flags/{id}/versions", response_model=List[FlagVersionResponse])
def list_flag_versions(id: int, db: Session = Depends(get_db)):
    flag = db.query(Flag).filter(Flag.id == id).first()
    if not flag:
        raise HTTPException(status_code=404, detail="Flag not found")
    versions = (
        db.query(FlagVersion)
        .filter(FlagVersion.flag_id == id)
        .order_by(FlagVersion.version.desc())
        .all()
    )
    return versions
