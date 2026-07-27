from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.utils.cache import clear_flag_cache

from app.models.flag import Flag
from app.models.environment import Environment
from app.models.flag_environment_override import FlagEnvironmentOverride

from app.schemas.flag_environment_override import (
    FlagEnvironmentOverrideCreate,
    FlagEnvironmentOverrideUpdate,
    FlagEnvironmentOverrideResponse,
)

router = APIRouter(
    prefix="/flag-overrides",
    tags=["Flag Environment Overrides"],
)


# ============================
# Create Override
# ============================
@router.post("/", response_model=FlagEnvironmentOverrideResponse)
def create_override(
    override: FlagEnvironmentOverrideCreate,
    db: Session = Depends(get_db),
):

    flag = db.query(Flag).filter(
        Flag.id == override.flag_id
    ).first()

    if not flag:
        raise HTTPException(
            status_code=404,
            detail="Flag not found",
        )

    environment = db.query(Environment).filter(
        Environment.id == override.environment_id
    ).first()

    if not environment:
        raise HTTPException(
            status_code=404,
            detail="Environment not found",
        )

    existing = db.query(
        FlagEnvironmentOverride
    ).filter(
        FlagEnvironmentOverride.flag_id == override.flag_id,
        FlagEnvironmentOverride.environment_id == override.environment_id,
    ).first()

    if existing:
        raise HTTPException(
            status_code=409,
            detail="Override already exists",
        )

    new_override = FlagEnvironmentOverride(
        flag_id=override.flag_id,
        environment_id=override.environment_id,
        override_value=override.override_value,
    )

    db.add(new_override)
    db.commit()
    db.refresh(new_override)

    # Clear Redis cache
    clear_flag_cache(flag.flag_key)

    return new_override


# ============================
# Get All Overrides
# ============================
@router.get("/", response_model=list[FlagEnvironmentOverrideResponse])
def get_overrides(
    db: Session = Depends(get_db),
):
    return db.query(
        FlagEnvironmentOverride
    ).all()


# ============================
# Update Override
# ============================
@router.put(
    "/{override_id}",
    response_model=FlagEnvironmentOverrideResponse
)
def update_override(
    override_id: int,
    override: FlagEnvironmentOverrideUpdate,
    db: Session = Depends(get_db),
):

    db_override = db.query(
        FlagEnvironmentOverride
    ).filter(
        FlagEnvironmentOverride.id == override_id
    ).first()

    if not db_override:
        raise HTTPException(
            status_code=404,
            detail="Override not found",
        )

    db_override.override_value = override.override_value

    db.commit()
    db.refresh(db_override)

    # Get flag and clear cache
    flag = db.query(Flag).filter(
        Flag.id == db_override.flag_id
    ).first()

    if flag:
        clear_flag_cache(flag.flag_key)

    return db_override


# ============================
# Delete Override
# ============================
@router.delete("/{override_id}")
def delete_override(
    override_id: int,
    db: Session = Depends(get_db),
):

    db_override = db.query(
        FlagEnvironmentOverride
    ).filter(
        FlagEnvironmentOverride.id == override_id
    ).first()

    if not db_override:
        raise HTTPException(
            status_code=404,
            detail="Override not found",
        )

    flag = db.query(Flag).filter(
        Flag.id == db_override.flag_id
    ).first()

    db.delete(db_override)
    db.commit()

    if flag:
        clear_flag_cache(flag.flag_key)

    return {
        "message": "Override deleted successfully"
    }