from pydantic import BaseModel


class GroupTargetingCreate(BaseModel):
    rule_value: str


class GroupTargetingResponse(BaseModel):
    id: int
    flag_id: int
    rule_type: str
    rule_value: str

    class Config:
        from_attributes = True