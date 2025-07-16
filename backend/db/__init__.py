# backend/db/__init__.py

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Import Base and models so metadata knows about them
from .base   import Base
from .models import Message, Category  # noqa: F401

# Use SQLite for local dev; will create a file called test.db
DATABASE_URL = "sqlite:///./test.db"

# 1) Create engine
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}  # Only for SQLite
)

# 2) Create all tables (messages, categories) if they don't exist
Base.metadata.create_all(bind=engine)

# 3) Session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)
