from typing import Optional
from pydantic import BaseModel


class EvaluationRequest(BaseModel):
    flag_key: str
    environment: str
    user: Optional[str] = None