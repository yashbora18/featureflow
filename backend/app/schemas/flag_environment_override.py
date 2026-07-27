from datetime import datetime
from pydantic import BaseModel


class FlagEnvironmentOverrideBase(BaseModel):
    flag_id: int
    environment_id: int
    override_value: str


class FlagEnvironmentOverrideCreate(
    FlagEnvironmentOverrideBase
):
    pass


class FlagEnvironmentOverrideUpdate(BaseModel):
    override_value: str


class FlagEnvironmentOverrideResponse(
    FlagEnvironmentOverrideBase
):
    id: int
    updated_at: datetime | None = None

    class Config:
        from_attributes = True