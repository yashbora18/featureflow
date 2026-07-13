from sqlalchemy import Column, Integer, String, ForeignKey
from app.core.database import Base


class FlagVersion(Base):
    __tablename__ = "flag_versions"

    id = Column(Integer, primary_key=True, index=True)
    flag_id = Column(Integer, ForeignKey("flags.id"), nullable=False)
    version = Column(Integer, nullable=False)
    config = Column(String, nullable=True)