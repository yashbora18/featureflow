from sqlalchemy import Column, Integer, String
from app.core.database import Base


class AuditLog(Base):
    __tablename__ = "audit_log"

    id = Column(Integer, primary_key=True, index=True)
    action = Column(String, nullable=False)
    user = Column(String, nullable=False)
    details = Column(String, nullable=True)