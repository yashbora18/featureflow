from typing import Optional
from pydantic import BaseModel


class HealthStatus(BaseModel):
    status: str
    db: Optional[str] = None
    redis: Optional[str] = None
    version: str = "1.0.0"
