from pydantic import BaseModel


class EnvironmentResponse(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True