from datetime import datetime, timezone

from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    ForeignKey,
    DateTime,
    UniqueConstraint,
)

from app.core.database import Base



class Flag(Base):

    __tablename__ = "flags"


    __table_args__ = (

        UniqueConstraint(

            "flag_key",

            "environment_id",

            name="unique_flag_environment"

        ),

    )



    id = Column(

        Integer,

        primary_key=True,

        index=True

    )



    flag_key = Column(

        String(100),

        index=True,

        nullable=False

    )



    flag_type = Column(

        String(20),

        nullable=False

    )



    default_value = Column(

        String(255),

        nullable=False

    )



    enabled = Column(

        Boolean,

        default=False

    )



    rollout_percentage = Column(

        Integer,

        default=100,

        nullable=False

    )



    description = Column(

        String(255)

    )



    owner_team = Column(

        String(100),

        nullable=False

    )



    environment_id = Column(

        Integer,

        ForeignKey("environments.id"),

        index=True,

        nullable=False

    )



    created_at = Column(

        DateTime(timezone=True),

        default=lambda: datetime.now(timezone.utc),

        nullable=False

    )



    updated_at = Column(

        DateTime(timezone=True),

        default=lambda: datetime.now(timezone.utc),

        onupdate=lambda: datetime.now(timezone.utc),

        nullable=False

    )