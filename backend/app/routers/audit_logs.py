from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.models.audit_log import AuditLog
from app.schemas.audit_log import AuditLogResponse

router = APIRouter(
    prefix="/audit-logs",
    tags=["Audit Logs"]
)


@router.get("/", response_model=list[AuditLogResponse])
def get_audit_logs(db: Session = Depends(get_db)):
    return (
        db.query(AuditLog)
        .order_by(AuditLog.id.desc())
        .all()
    )