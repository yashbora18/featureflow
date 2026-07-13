from sqlalchemy import Column, Integer, String, DateTime, text
from database.connection import Base


class UserGroupMembership(Base):
    __tablename__ = "user_group_memberships"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(255), nullable=False, index=True)
    group_name = Column(String(255), nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=text("NOW()"))
