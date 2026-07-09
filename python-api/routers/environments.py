import json
from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from database.connection import get_db
from models.audit_log import AuditLog
from models.environment import Environment
from models.flag import Flag
from schemas.environment import EnvironmentInput, EnvironmentResponse, EnvironmentUpdate

router = APIRouter()


def _env_to_response(env: Environment, db: Session) -> EnvironmentResponse:
    flag_count = db.query(func.count(Flag.id)).filter(Flag.environment_id == env.id).scalar() or 0
    enabled_count = (
        db.query(func.count(Flag.id))
        .filter(Flag.environment_id == env.id, Flag.enabled == True)
        .scalar()
        or 0
    )
    return EnvironmentResponse(
        id=env.id,
        name=env.name,
        slug=env.slug,
        description=env.description,
        color=env.color,
        is_default=env.is_default,
        flag_count=flag_count,
        enabled_count=enabled_count,
        created_at=env.created_at,
        updated_at=env.updated_at,
    )


def _log_audit(db: Session, entity_type: str, entity_id: int, entity_name: str, action: str, changes: dict = None, environment_id: int = None):
    entry = AuditLog(
        entity_type=entity_type,
        entity_id=entity_id,
        entity_name=entity_name,
        action=action,
        changes=json.dumps(changes) if changes else None,
        environment_id=environment_id,
    )
    db.add(entry)


@router.get("/environments", response_model=List[EnvironmentResponse])
def list_environments(db: Session = Depends(get_db)):
    envs = db.query(Environment).order_by(Environment.id).all()
    return [_env_to_response(e, db) for e in envs]


@router.post("/environments", response_model=EnvironmentResponse, status_code=201)
def create_environment(body: EnvironmentInput, db: Session = Depends(get_db)):
    # If is_default, unset others
    if body.is_default:
        db.query(Environment).update({"is_default": False})

    env = Environment(
        name=body.name,
        slug=body.slug,
        description=body.description,
        color=body.color or "#6366f1",
        is_default=body.is_default,
    )
    db.add(env)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail=f"An environment with slug '{body.slug}' already exists")
    db.refresh(env)
    _log_audit(db, "environment", env.id, env.name, "created")
    db.commit()
    return _env_to_response(env, db)


@router.get("/environments/{id}", response_model=EnvironmentResponse)
def get_environment(id: int, db: Session = Depends(get_db)):
    env = db.query(Environment).filter(Environment.id == id).first()
    if not env:
        raise HTTPException(status_code=404, detail="Environment not found")
    return _env_to_response(env, db)


@router.put("/environments/{id}", response_model=EnvironmentResponse)
def update_environment(id: int, body: EnvironmentUpdate, db: Session = Depends(get_db)):
    env = db.query(Environment).filter(Environment.id == id).first()
    if not env:
        raise HTTPException(status_code=404, detail="Environment not found")

    changes = {}
    if body.name is not None:
        changes["name"] = {"from": env.name, "to": body.name}
        env.name = body.name
    if body.description is not None:
        env.description = body.description
    if body.color is not None:
        env.color = body.color
    if body.is_default is not None:
        if body.is_default:
            db.query(Environment).filter(Environment.id != id).update({"is_default": False})
        env.is_default = body.is_default

    env.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(env)
    _log_audit(db, "environment", env.id, env.name, "updated", changes)
    db.commit()
    return _env_to_response(env, db)


@router.delete("/environments/{id}", status_code=204)
def delete_environment(id: int, db: Session = Depends(get_db)):
    env = db.query(Environment).filter(Environment.id == id).first()
    if not env:
        raise HTTPException(status_code=404, detail="Environment not found")
    _log_audit(db, "environment", env.id, env.name, "deleted")
    db.delete(env)
    db.commit()
