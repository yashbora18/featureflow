from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.models.flag import Flag
from app.models.environment import Environment
from app.schemas.flag import FlagCreate, FlagResponse
from app.services.evaluation_service import evaluate_flag

router = APIRouter(
    prefix="/flags",
    tags=["Flags"]
)


# ==============================
# Create Feature Flag
# ==============================
@router.post("/", response_model=FlagResponse)
def create_flag(flag: FlagCreate, db: Session = Depends(get_db)):

    # Check duplicate flag key
    existing_flag = db.query(Flag).filter(
        Flag.flag_key == flag.flag_key
    ).first()

    if existing_flag:
        raise HTTPException(
            status_code=409,
            detail="Flag key already exists"
        )

    # Check environment exists
    environment = db.query(Environment).filter(
        Environment.id == flag.environment_id
    ).first()

    if not environment:
        raise HTTPException(
            status_code=404,
            detail="Invalid environment"
        )

    new_flag = Flag(
        flag_key=flag.flag_key,
        flag_type=flag.flag_type,
        default_value=flag.default_value,
        enabled=flag.enabled,
        description=flag.description,
        owner_team=flag.owner_team,
        environment_id=flag.environment_id
    )

    db.add(new_flag)
    db.commit()
    db.refresh(new_flag)

    return new_flag


# ==============================
# Get All Feature Flags
# ==============================
@router.get("/", response_model=list[FlagResponse])
def get_flags(db: Session = Depends(get_db)):
    return db.query(Flag).all()


# ==============================
# Get Feature Flag By Key
# ==============================
@router.get("/{key}", response_model=FlagResponse)
def get_flag(key: str, db: Session = Depends(get_db)):

    flag = db.query(Flag).filter(
        Flag.flag_key == key
    ).first()

    if not flag:
        raise HTTPException(
            status_code=404,
            detail="Flag not found"
        )

    return flag


# ==============================
# Update Feature Flag
# ==============================
@router.put("/{key}", response_model=FlagResponse)
def update_flag(
    key: str,
    updated_flag: FlagCreate,
    db: Session = Depends(get_db)
):

    flag = db.query(Flag).filter(
        Flag.flag_key == key
    ).first()

    if not flag:
        raise HTTPException(
            status_code=404,
            detail="Flag not found"
        )

    # Check duplicate key (excluding current flag)
    duplicate = db.query(Flag).filter(
        Flag.flag_key == updated_flag.flag_key,
        Flag.id != flag.id
    ).first()

    if duplicate:
        raise HTTPException(
            status_code=409,
            detail="Flag key already exists"
        )

    # Validate environment
    environment = db.query(Environment).filter(
        Environment.id == updated_flag.environment_id
    ).first()

    if not environment:
        raise HTTPException(
            status_code=404,
            detail="Invalid environment"
        )

    flag.flag_key = updated_flag.flag_key
    flag.flag_type = updated_flag.flag_type
    flag.default_value = updated_flag.default_value
    flag.enabled = updated_flag.enabled
    flag.description = updated_flag.description
    flag.owner_team = updated_flag.owner_team
    flag.environment_id = updated_flag.environment_id

    db.commit()
    db.refresh(flag)

    return flag


# ==============================
# Evaluate Feature Flag
# ==============================
@router.get("/evaluate/")
def evaluate(
    flag_key: str,
    environment_id: int,
    db: Session = Depends(get_db)
):

    return evaluate_flag(
        flag_key,
        environment_id,
        db
    )

# Delete a Feature Flag
@router.delete("/{key}")
def delete_flag(key: str, db: Session = Depends(get_db)):
    flag = db.query(Flag).filter(Flag.flag_key == key).first()

    if flag is None:
        raise HTTPException(
            status_code=404,
            detail="Flag not found"
        )

    db.delete(flag)
    db.commit()

    return {
        "message": f"Flag '{key}' deleted successfully"
    }