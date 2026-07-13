from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, text
from database.connection import Base


class FlagVersion(Base):
    __tablename__ = "flag_versions"

    id = Column(Integer, primary_key=True, index=True)
    flag_id = Column(
        Integer,
        ForeignKey("flags.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    version = Column(Integer, nullable=False)
    enabled = Column(Boolean, nullable=False)
    default_value = Column(String(1000), nullable=True)
    changed_by = Column(String(255), nullable=True)
    change_description = Column(String(1000), nullable=True)
    created_at = Column(DateTime, nullable=False, server_default=text("NOW()"))
