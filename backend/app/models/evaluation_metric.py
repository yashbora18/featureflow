from datetime import datetime, timezone

from sqlalchemy import (
    Column,
    Integer,
    String,
    Date,
    DateTime
)

from app.core.database import Base



class EvaluationMetric(Base):

    __tablename__ = "evaluation_metrics"



    id = Column(

        Integer,

        primary_key=True,

        index=True

    )



    flag_key = Column(

        String(100),

        nullable=False,

        index=True

    )



    environment_id = Column(

        Integer,

        nullable=False,

        index=True

    )



    date = Column(

        Date,

        nullable=False

    )



    evaluation_count = Column(

        Integer,

        default=0,

        nullable=False

    )



    created_at = Column(

        DateTime(timezone=True),

        default=lambda:

        datetime.now(timezone.utc),

        nullable=False

    )