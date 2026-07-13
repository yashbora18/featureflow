from app.core.database import Base, engine

# Import all models
from app.models.environment import Environment
from app.models.flag import Flag
from app.models.flag_version import FlagVersion
from app.models.targeting_rule import TargetingRule
from app.models.user_group_membership import UserGroupMembership
from app.models.audit_log import AuditLog

# Create all tables
Base.metadata.create_all(bind=engine)

print("All tables created successfully!")