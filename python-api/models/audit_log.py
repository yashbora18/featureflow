from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, text
from database.connection import Base


class AuditLog(Base):
    __tablename__ = "audit_log"

    id = Column(Integer, primary_key=True, index=True)
    entity_type = Column(String(100), nullable=False)
    entity_id = Column(Integer, nullable=False)
    entity_name = Column(String(255), nullable=True)
    action = Column(String(100), nullable=False)  # created, updated, deleted, toggled
    user_id = Column(String(255), nullable=True)
    changes = Column(String(10000), nullable=True)  # JSON string
    environment_id = Column(
        Integer,
        ForeignKey("environments.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    created_at = Column(DateTime, nullable=False, server_default=text("NOW()"))
