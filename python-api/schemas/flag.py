from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, ConfigDict


class FlagInput(BaseModel):
    key: str
    name: str
    description: Optional[str] = None
    flag_type: str = "boolean"
    default_value: Optional[str] = None
    enabled: Optional[bool] = False
    environment_id: int
    owner: Optional[str] = None


class FlagUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    flag_type: Optional[str] = None
    default_value: Optional[str] = None
    enabled: Optional[bool] = None
    owner: Optional[str] = None


class FlagResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    key: str
    name: str
    description: Optional[str] = None
    enabled: bool
    flag_type: str
    default_value: Optional[str] = None
    owner: Optional[str] = None
    environment_id: int
    environment_name: str
    targeting_rules_count: int = 0
    version: int
    created_at: datetime
    updated_at: datetime


class FlagVersionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    flag_id: int
    version: int
    enabled: bool
    default_value: Optional[str] = None
    changed_by: Optional[str] = None
    change_description: Optional[str] = None
    created_at: datetime


class FlagsSummary(BaseModel):
    total_flags: int
    enabled_flags: int
    disabled_flags: int
    total_environments: int
    flags_by_type: Dict[str, int]
    recent_changes: int
    targeting_rules_count: int
