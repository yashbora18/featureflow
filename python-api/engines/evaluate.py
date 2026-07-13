"""
Feature Flag Evaluation Engine.

Resolves the effective boolean value of a flag for a given environment
and optional user context.  The engine is intentionally kept stateless
and side-effect-free so it can be called from any layer (router, SDK,
background job) without coupling to the HTTP request lifecycle.
"""
from typing import Any, Dict, Optional
from sqlalchemy.orm import Session

from models.environment import Environment
from models.flag import Flag


class EvaluationResult:
    def __init__(self, enabled: bool, flag_key: str, environment: str, reason: str) -> None:
        self.enabled = enabled
        self.flag_key = flag_key
        self.environment = environment
        self.reason = reason


def evaluate_flag(
    flag_key: str,
    environment_name: str,
    db: Session,
    user_context: Optional[Dict[str, Any]] = None,
) -> EvaluationResult:
    """
    Evaluate a feature flag and return its resolved boolean value.

    Resolution order:
      1. If the environment does not exist → return False ("environment_not_found").
      2. If the flag does not exist in that environment → return False ("flag_not_found").
      3. If the flag is disabled at the environment level → return False ("flag_disabled").
      4. Otherwise → return True ("flag_enabled").

    user_context is accepted but reserved for targeting-rule evaluation in a
    future iteration; it does not influence the result today.
    """
    # Step 1 – resolve environment.
    # First try an exact slug match (slug is unique), then fall back to a
    # case-insensitive name match.  If the name matches more than one row we
    # surface an explicit error rather than silently picking the wrong one.
    env = db.query(Environment).filter(Environment.slug == environment_name).first()
    if env is None:
        envs = (
            db.query(Environment)
            .filter(Environment.name.ilike(environment_name))
            .all()
        )
        if not envs:
            return EvaluationResult(
                enabled=False,
                flag_key=flag_key,
                environment=environment_name,
                reason="environment_not_found",
            )
        if len(envs) > 1:
            # Surface ambiguity rather than silently picking the wrong one.
            raise ValueError(
                f"Ambiguous environment '{environment_name}': {len(envs)} environments share "
                "that name. Use the environment slug to disambiguate."
            )
        env = envs[0]

    # Step 2 – resolve flag within that environment
    flag = (
        db.query(Flag)
        .filter(Flag.key == flag_key, Flag.environment_id == env.id)
        .first()
    )
    if flag is None:
        return EvaluationResult(
            enabled=False,
            flag_key=flag_key,
            environment=env.name,
            reason="flag_not_found",
        )

    # Step 3 – check environment-level enabled state
    if not flag.enabled:
        return EvaluationResult(
            enabled=False,
            flag_key=flag_key,
            environment=env.name,
            reason="flag_disabled",
        )

    # Step 4 – flag is active
    return EvaluationResult(
        enabled=True,
        flag_key=flag_key,
        environment=env.name,
        reason="flag_enabled",
    )
