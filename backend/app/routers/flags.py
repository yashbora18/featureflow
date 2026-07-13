from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.flag import Flag
from app.schemas.flag import FlagCreate, FlagUpdate

router = APIRouter(
    prefix="/flags",
    tags=["Flags"]
)


# Database Session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# GET ALL FLAGS
@router.get("/")
def get_flags(db: Session = Depends(get_db)):
    return db.query(Flag).all()


# GET SINGLE FLAG
@router.get("/{key}")
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


# CREATE FLAG
@router.post("/")
def create_flag(flag: FlagCreate, db: Session = Depends(get_db)):

    existing_flag = db.query(Flag).filter(
        Flag.flag_key == flag.flag_key
    ).first()

    if existing_flag:
        raise HTTPException(
            status_code=400,
            detail="Flag already exists"
        )

    new_flag = Flag(
        flag_key=flag.flag_key,
        name=flag.name,
        flag_type=flag.flag_type,
        default_value=flag.default_value,
        is_enabled=flag.is_enabled,
        description=flag.description,
        owner_team=flag.owner_team
    )

    db.add(new_flag)
    db.commit()
    db.refresh(new_flag)

    return new_flag


# UPDATE FLAG
@router.put("/{key}")
def update_flag(
    key: str,
    flag_data: FlagUpdate,
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

    update_data = flag_data.dict(exclude_unset=True)

    for field, value in update_data.items():
        setattr(flag, field, value)

    db.commit()
    db.refresh(flag)

    return flag


# DELETE FLAG
@router.delete("/{key}")
def delete_flag(
    key: str,
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

    db.delete(flag)
    db.commit()

    return {
        "message": "Feature Flag deleted successfully"
    }