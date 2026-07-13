from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.environment import Environment
from app.schemas.environment import EnvironmentResponse

router = APIRouter(
    prefix="/environments",
    tags=["Environments"]
)

# Database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=list[EnvironmentResponse])
def get_environments(db: Session = Depends(get_db)):
    return db.query(Environment).all()