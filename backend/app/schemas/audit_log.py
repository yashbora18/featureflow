from pydantic import BaseModel


class AuditLogResponse(BaseModel):
    id: int
    action: str
    actor: str
    flag_key: str
    environment: str
    timestamp: str
    diff: str | None = None

    class Config:
        from_attributes = True