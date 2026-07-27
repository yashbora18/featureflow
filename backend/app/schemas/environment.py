from pydantic import BaseModel
from typing import Optional


class EnvironmentBase(BaseModel):
    name: str
    description: Optional[str] = None


class EnvironmentCreate(EnvironmentBase):
    pass


class EnvironmentUpdate(EnvironmentBase):
    pass


class EnvironmentResponse(EnvironmentBase):
    id: int

    class Config:
        from_attributes = True