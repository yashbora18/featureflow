from datetime import datetime
from pydantic import BaseModel

class FlagCreate(BaseModel):
    flag_key: str
    flag_type: str
    default_value: bool
    enabled: bool
    description: str
    owner_team: str
    environment_id: int


class FlagResponse(BaseModel):
    id: int
    flag_key: str
    flag_type: str
    default_value: bool
    enabled: bool
    description: str
    owner_team: str
    environment_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True