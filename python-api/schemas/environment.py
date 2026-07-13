from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class EnvironmentInput(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    color: str = "#6366f1"
    is_default: bool = False


class EnvironmentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    color: Optional[str] = None
    is_default: Optional[bool] = None


class EnvironmentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    slug: str
    description: Optional[str] = None
    color: str
    is_default: bool
    flag_count: int = 0
    enabled_count: int = 0
    created_at: datetime
    updated_at: datetime
