"""
Medical models for database
"""

from sqlalchemy import Column, String, DateTime, Text, ForeignKey, Enum as SQLEnum, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
import enum

from app.core.database import Base


class SeverityLevel(str, enum.Enum):
    """Severity level enum."""
    mild = "mild"
    moderate = "moderate"
    severe = "severe"


class MedicalCondition(Base):
    """Medical condition model."""
    __tablename__ = "medical_conditions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    name = Column(String(255), nullable=False)
    diagnosed_date = Column(DateTime, nullable=True)
    severity = Column(String(20), default="mild")  # Use String for SQLite compatibility
    notes = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class Allergy(Base):
    """Allergy model."""
    __tablename__ = "allergies"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    allergen = Column(String(255), nullable=False)
    allergy_type = Column(String(100), nullable=True)  # Food, Drug, Environmental, etc.
    severity = Column(String(20), default="mild")  # Use String for SQLite compatibility
    symptoms = Column(JSON, nullable=True)  # Use JSON instead of ARRAY for SQLite compatibility
    notes = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class SkinProblem(Base):
    """Skin problem model."""
    __tablename__ = "skin_problems"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    condition = Column(String(255), nullable=False)
    body_part = Column(String(100), nullable=True)
    severity = Column(String(20), default="mild")  # Use String for SQLite compatibility
    duration = Column(String(100), nullable=True)
    treatment = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class BasicInfo(Base):
    """Basic medical info model."""
    __tablename__ = "basic_info"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, unique=True, index=True)
    
    age = Column(String(10), nullable=True)
    gender = Column(String(20), nullable=True)
    blood_type = Column(String(10), nullable=True)
    height = Column(String(20), nullable=True)
    weight = Column(String(20), nullable=True)
    emergency_contact = Column(String(255), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class ChatHistory(Base):
    """Chat history for AI conversations."""
    __tablename__ = "chat_history"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    message = Column(Text, nullable=False)
    response = Column(Text, nullable=False)
    chat_type = Column(String(50), nullable=True)  # nutrition, medical, general
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
