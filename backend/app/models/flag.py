from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from app.core.database import Base


class Flag(Base):
    __tablename__ = "flags"

    id = Column(Integer, primary_key=True, index=True)
    flag_key = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    is_enabled = Column(Boolean, default=False)

    # Day 3 fields
    flag_type = Column(String, nullable=False, default="boolean")
    default_value = Column(String, nullable=False, default="false")
    owner_team = Column(String, nullable=True)

    # Day 2 field
    environment_id = Column(Integer, ForeignKey("environments.id"), index=True)