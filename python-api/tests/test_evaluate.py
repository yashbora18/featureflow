"""
Unit tests for the Feature Flag Evaluation Engine (engines/evaluate.py).

Covers the required Day 5 scenarios:
  1. Environment not found
  2. Flag not found
  3. Flag disabled
  4. Flag enabled
  5. Empty user context
"""
import pytest

from engines.evaluate import evaluate_flag
from tests.conftest import make_environment, make_flag


def test_environment_not_found(db_session):
    result = evaluate_flag("any-flag", "does-not-exist", db_session)

    assert result.enabled is False
    assert result.reason == "environment_not_found"
    assert result.flag_key == "any-flag"
    assert result.environment == "does-not-exist"


def test_flag_not_found(db_session):
    env = make_environment(db_session)

    result = evaluate_flag("missing-flag", env.slug, db_session)

    assert result.enabled is False
    assert result.reason == "flag_not_found"
    assert result.flag_key == "missing-flag"
    assert result.environment == env.name


def test_flag_disabled(db_session):
    env = make_environment(db_session)
    flag = make_flag(db_session, environment_id=env.id, key="disabled-flag", enabled=False)

    result = evaluate_flag(flag.key, env.slug, db_session)

    assert result.enabled is False
    assert result.reason == "flag_disabled"
    assert result.flag_key == flag.key
    assert result.environment == env.name


def test_flag_enabled(db_session):
    env = make_environment(db_session)
    flag = make_flag(db_session, environment_id=env.id, key="enabled-flag", enabled=True)

    result = evaluate_flag(flag.key, env.slug, db_session)

    assert result.enabled is True
    assert result.reason == "flag_enabled"
    assert result.flag_key == flag.key
    assert result.environment == env.name


def test_ambiguous_environment_name_raises(db_session):
    make_environment(db_session, name="Staging", slug="staging-a")
    make_environment(db_session, name="Staging", slug="staging-b")

    with pytest.raises(ValueError):
        evaluate_flag("any-flag", "Staging", db_session)


def test_empty_user_context_does_not_affect_result(db_session):
    env = make_environment(db_session)
    flag = make_flag(db_session, environment_id=env.id, key="context-flag", enabled=True)

    result_with_empty_context = evaluate_flag(flag.key, env.slug, db_session, user_context={})
    result_without_context = evaluate_flag(flag.key, env.slug, db_session, user_context=None)

    assert result_with_empty_context.enabled is True
    assert result_with_empty_context.reason == "flag_enabled"
    assert result_with_empty_context.enabled == result_without_context.enabled
    assert result_with_empty_context.reason == result_without_context.reason
