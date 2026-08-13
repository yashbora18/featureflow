from datetime import datetime

from sqlalchemy import Column, Integer, String, Text

from app.core.database import Base


class AuditLog(Base):
    __tablename__ = "audit_log"

    id = Column(Integer, primary_key=True, index=True)

    action = Column(String(100), nullable=False)
    actor = Column(String(100), nullable=False)
    flag_key = Column(String(100), nullable=False)
    environment = Column(String(100), nullable=False)

    timestamp = Column(
        String(100),
        nullable=False,
        default=lambda: datetime.now().isoformat()
    )

    diff = Column(Text, nullable=True)