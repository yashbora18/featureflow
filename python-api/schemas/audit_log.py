from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict


class AuditLogResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    entity_type: str
    entity_id: int
    entity_name: Optional[str] = None
    action: str
    user_id: Optional[str] = None
    changes: Optional[str] = None
    environment_id: Optional[int] = None
    environment_name: Optional[str] = None
    created_at: datetime


class AuditLogList(BaseModel):
    items: List[AuditLogResponse]
    total: int
    limit: int
    offset: int
