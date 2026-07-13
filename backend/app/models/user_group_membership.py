from sqlalchemy import Column, Integer, String
from app.core.database import Base


class UserGroupMembership(Base):
    __tablename__ = "user_group_memberships"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, nullable=False)
    group_name = Column(String, nullable=False)