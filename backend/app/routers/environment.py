from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.environment import Environment
from app.schemas.environment import (
    EnvironmentCreate,
    EnvironmentUpdate,
    EnvironmentResponse,
)

router = APIRouter(
    prefix="/environments",
    tags=["Environments"]
)


# Database Session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Create Environment
@router.post("/", response_model=EnvironmentResponse)
def create_environment(
    environment: EnvironmentCreate,
    db: Session = Depends(get_db)
):
    existing = (
        db.query(Environment)
        .filter(Environment.name == environment.name)
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Environment already exists"
        )

    new_environment = Environment(
        name=environment.name,
        description=environment.description
    )

    db.add(new_environment)
    db.commit()
    db.refresh(new_environment)

    return new_environment


# Get All Environments
@router.get("/", response_model=list[EnvironmentResponse])
def get_environments(
    db: Session = Depends(get_db)
):
    return db.query(Environment).all()


# Update Environment
@router.put("/{environment_id}", response_model=EnvironmentResponse)
def update_environment(
    environment_id: int,
    environment: EnvironmentUpdate,
    db: Session = Depends(get_db)
):
    db_environment = (
        db.query(Environment)
        .filter(Environment.id == environment_id)
        .first()
    )

    if not db_environment:
        raise HTTPException(
            status_code=404,
            detail="Environment not found"
        )

    db_environment.name = environment.name
    db_environment.description = environment.description

    db.commit()
    db.refresh(db_environment)

    return db_environment


# Delete Environment
@router.delete("/{environment_id}")
def delete_environment(
    environment_id: int,
    db: Session = Depends(get_db)
):
    environment = (
        db.query(Environment)
        .filter(Environment.id == environment_id)
        .first()
    )

    if not environment:
        raise HTTPException(
            status_code=404,
            detail="Environment not found"
        )

    db.delete(environment)
    db.commit()

    return {
        "message": "Environment deleted successfully"
    }