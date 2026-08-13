from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base


DATABASE_URL = "postgresql://postgres:Yash0801%40@localhost:5432/feature_flag_db"


engine = create_engine(
    DATABASE_URL
)


SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


Base = declarative_base()



# Database Dependency

def get_db():

    db = SessionLocal()

    try:

        yield db

    finally:

        db.close()