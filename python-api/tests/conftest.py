"""
Shared pytest fixtures for the evaluation engine test suite.

Uses an isolated in-memory SQLite database purely for these unit tests so
they run fast and don't touch the real Postgres database. The engine under
test (engines/evaluate.py) only relies on generic SQLAlchemy Session query
behavior, so swapping the backend here has no effect on production, which
continues to use DATABASE_URL / Postgres via database/connection.py.
"""
from datetime import datetime, timezone

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from database.connection import Base
from models.environment import Environment
from models.flag import Flag


@pytest.fixture()
def db_session():
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    Base.metadata.create_all(bind=engine)
    TestingSessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        engine.dispose()


def make_environment(db_session, **overrides):
    now = datetime.now(timezone.utc)
    defaults = dict(
        name="Production",
        slug="production",
        description=None,
        color="#6366f1",
        is_default=True,
        created_at=now,
        updated_at=now,
    )
    defaults.update(overrides)
    env = Environment(**defaults)
    db_session.add(env)
    db_session.commit()
    db_session.refresh(env)
    return env


def make_flag(db_session, environment_id, **overrides):
    now = datetime.now(timezone.utc)
    defaults = dict(
        key="new-checkout-flow",
        name="New Checkout Flow",
        description="Rolls out the redesigned checkout flow.",
        enabled=True,
        flag_type="boolean",
        default_value="false",
        environment_id=environment_id,
        owner="team-payments",
        version=1,
        created_at=now,
        updated_at=now,
    )
    defaults.update(overrides)
    flag = Flag(**defaults)
    db_session.add(flag)
    db_session.commit()
    db_session.refresh(flag)
    return flag
