from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class TargetingRuleInput(BaseModel):
    flag_id: int
    environment_id: int
    name: str
    conditions: str = "{}"
    rollout_percentage: int = 100
    enabled: bool = True
    priority: int = 0


class TargetingRuleUpdate(BaseModel):
    name: Optional[str] = None
    conditions: Optional[str] = None
    rollout_percentage: Optional[int] = None
    enabled: Optional[bool] = None
    priority: Optional[int] = None


class TargetingRuleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    flag_id: int
    environment_id: int
    name: str
    conditions: str
    rollout_percentage: int
    enabled: bool
    priority: int
    created_at: datetime
    updated_at: datetime
