from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, text
from database.connection import Base


class TargetingRule(Base):
    __tablename__ = "targeting_rules"

    id = Column(Integer, primary_key=True, index=True)
    flag_id = Column(
        Integer,
        ForeignKey("flags.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    environment_id = Column(
        Integer,
        ForeignKey("environments.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    name = Column(String(255), nullable=False)
    conditions = Column(String(5000), nullable=False, default="{}")
    rollout_percentage = Column(Integer, nullable=False, default=100)
    enabled = Column(Boolean, nullable=False, default=True)
    priority = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime, nullable=False, server_default=text("NOW()"))
    updated_at = Column(DateTime, nullable=False, server_default=text("NOW()"))
