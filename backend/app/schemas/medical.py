"""
Medical schemas for API validation
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from uuid import UUID
from enum import Enum


class SeverityLevel(str, Enum):
    """Severity level enum."""
    mild = "mild"
    moderate = "moderate"
    severe = "severe"


# Medical Condition Schemas
class MedicalConditionBase(BaseModel):
    """Base medical condition schema."""
    name: str
    diagnosed_date: Optional[str] = None
    severity: SeverityLevel = SeverityLevel.mild
    notes: Optional[str] = None


class MedicalConditionCreate(MedicalConditionBase):
    """Schema for creating medical condition."""
    pass


class MedicalConditionUpdate(BaseModel):
    """Schema for updating medical condition."""
    name: Optional[str] = None
    diagnosed_date: Optional[str] = None
    severity: Optional[SeverityLevel] = None
    notes: Optional[str] = None


class MedicalConditionResponse(MedicalConditionBase):
    """Schema for medical condition response."""
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# Allergy Schemas
class AllergyBase(BaseModel):
    """Base allergy schema."""
    allergen: str
    allergy_type: Optional[str] = None
    severity: SeverityLevel = SeverityLevel.mild
    symptoms: Optional[List[str]] = None
    notes: Optional[str] = None


class AllergyCreate(AllergyBase):
    """Schema for creating allergy."""
    pass


class AllergyUpdate(BaseModel):
    """Schema for updating allergy."""
    allergen: Optional[str] = None
    allergy_type: Optional[str] = None
    severity: Optional[SeverityLevel] = None
    symptoms: Optional[List[str]] = None
    notes: Optional[str] = None


class AllergyResponse(AllergyBase):
    """Schema for allergy response."""
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# Skin Problem Schemas
class SkinProblemBase(BaseModel):
    """Base skin problem schema."""
    condition: str
    body_part: Optional[str] = None
    severity: SeverityLevel = SeverityLevel.mild
    duration: Optional[str] = None
    treatment: Optional[str] = None
    notes: Optional[str] = None


class SkinProblemCreate(SkinProblemBase):
    """Schema for creating skin problem."""
    pass


class SkinProblemUpdate(BaseModel):
    """Schema for updating skin problem."""
    condition: Optional[str] = None
    body_part: Optional[str] = None
    severity: Optional[SeverityLevel] = None
    duration: Optional[str] = None
    treatment: Optional[str] = None
    notes: Optional[str] = None


class SkinProblemResponse(SkinProblemBase):
    """Schema for skin problem response."""
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# Basic Info Schemas
class BasicInfoBase(BaseModel):
    """Base basic info schema."""
    age: Optional[str] = None
    gender: Optional[str] = None
    blood_type: Optional[str] = None
    height: Optional[str] = None
    weight: Optional[str] = None
    emergency_contact: Optional[str] = None


class BasicInfoCreate(BasicInfoBase):
    """Schema for creating basic info."""
    pass


class BasicInfoUpdate(BasicInfoBase):
    """Schema for updating basic info."""
    pass


class BasicInfoResponse(BasicInfoBase):
    """Schema for basic info response."""
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# Chat Schemas
class ChatMessage(BaseModel):
    """Chat message schema."""
    message: str
    chat_type: Optional[str] = "general"  # nutrition, medical, general


class ChatResponse(BaseModel):
    """Chat response schema."""
    id: UUID
    message: str
    response: str
    chat_type: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


# Test Booking Schemas
class TestBookingBase(BaseModel):
    """Base test booking schema."""
    test_name: str
    test_type: Optional[str] = None
    booking_date: str  # ISO format date
    notes: Optional[str] = None


class TestBookingCreate(TestBookingBase):
    """Schema for creating test booking."""
    pass


class TestBookingUpdate(BaseModel):
    """Schema for updating test booking."""
    test_name: Optional[str] = None
    test_type: Optional[str] = None
    booking_date: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None


class TestBookingResponse(TestBookingBase):
    """Schema for test booking response."""
    id: UUID
    user_id: UUID
    status: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# Doctor Appointment Schemas
class DoctorAppointmentBase(BaseModel):
    """Base doctor appointment schema."""
    doctor_id: UUID
    appointment_date: str  # ISO format date
    appointment_time: str  # HH:MM format
    reason: Optional[str] = None
    notes: Optional[str] = None


class DoctorAppointmentCreate(DoctorAppointmentBase):
    """Schema for creating doctor appointment."""
    pass


class DoctorAppointmentUpdate(BaseModel):
    """Schema for updating doctor appointment."""
    appointment_date: Optional[str] = None
    appointment_time: Optional[str] = None
    reason: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None


class DoctorAppointmentResponse(DoctorAppointmentBase):
    """Schema for doctor appointment response."""
    id: UUID
    patient_id: UUID
    status: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
