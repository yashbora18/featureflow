from pydantic import BaseModel
from typing import Optional


class FlagBase(BaseModel):
    flag_key: str
    name: str
    flag_type: str
    default_value: str
    is_enabled: bool
    description: Optional[str] = None
    owner_team: Optional[str] = None


class FlagCreate(FlagBase):
    pass


class FlagUpdate(BaseModel):
    name: Optional[str] = None
    flag_type: Optional[str] = None
    default_value: Optional[str] = None
    is_enabled: Optional[bool] = None
    description: Optional[str] = None
    owner_team: Optional[str] = None


class FlagResponse(FlagBase):
    id: int

    class Config:
        orm_mode = True