from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func

from app.core.database import Base


class CleanupReview(Base):
    __tablename__ = "cleanup_reviews"

    id = Column(Integer, primary_key=True, index=True)

    flag_key = Column(
        String(100),
        unique=True,
        nullable=False,
    )

    reviewed_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )