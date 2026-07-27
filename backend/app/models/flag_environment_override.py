from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DateTime,
)
from sqlalchemy.sql import func

from app.core.database import Base


class FlagEnvironmentOverride(Base):
    __tablename__ = "flag_environment_overrides"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    flag_id = Column(
        Integer,
        ForeignKey("flags.id"),
        nullable=False,
        index=True
    )

    environment_id = Column(
        Integer,
        ForeignKey("environments.id"),
        nullable=False,
        index=True
    )

    override_value = Column(
        String(255),
        nullable=False
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )