# backend/db/models.py

import datetime
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from .base import Base

class Message(Base):
    __tablename__ = "messages"

    id        = Column(Integer, primary_key=True, index=True)
    content   = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

class Category(Base):
    __tablename__ = "categories"

    id         = Column(Integer, primary_key=True, index=True)
    name       = Column(String, nullable=False)
    message_id = Column(Integer, ForeignKey("messages.id"), nullable=False)
