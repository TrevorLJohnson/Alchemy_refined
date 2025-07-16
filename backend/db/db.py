# backend/db/__init__.py

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Import your Base and models so metadata knows about them
from .base import Base
from .models import Message, Category  # noqa: F401

# SQLite database URL (adjust if you need a different path or engine)
DATABASE_URL = "sqlite:///./test.db"

# 1) Create the engine
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}  # only for SQLite
)

# 2) Create all tables defined on Base (Message, Category, etc.)
Base.metadata.create_all(bind=engine)

# 3) Configure a session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)
