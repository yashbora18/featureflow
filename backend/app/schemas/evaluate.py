from pydantic import BaseModel

class EvaluateRequest(BaseModel):
    flag_key: str
    environment_id: int
    evaluation_type: str
    evaluation_value: str


class EvaluateResponse(BaseModel):
    flag_key: str
    enabled: bool
    reason: str