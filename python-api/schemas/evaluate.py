from typing import Any, Dict, Optional
from pydantic import BaseModel, Field


class EvaluateRequest(BaseModel):
    flag_key: str = Field(..., description="The string key of the feature flag to evaluate")
    environment: str = Field(..., description="Environment name (e.g. 'Production', 'Staging')")
    user_context: Optional[Dict[str, Any]] = Field(
        default=None,
        description="Optional caller context (user_id, attributes, etc.) reserved for rule matching",
    )


class EvaluateResponse(BaseModel):
    enabled: bool = Field(..., description="Resolved boolean value of the feature flag")
    flag_key: str = Field(..., description="The flag key that was evaluated")
    environment: str = Field(..., description="The environment that was used for evaluation")
    reason: str = Field(..., description="Short explanation of how the value was resolved")
