"""
Booking endpoints for tests and doctor appointments
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, func
from typing import List
from datetime import datetime
from uuid import UUID

from app.core.database import get_db
from app.core.security import get_current_user
from app.schemas.medical import (
    TestBookingCreate,
    TestBookingResponse,
    TestBookingUpdate,
    DoctorAppointmentCreate,
    DoctorAppointmentResponse,
    DoctorAppointmentUpdate
)
from app.models.medical import TestBooking, DoctorAppointment

router = APIRouter()


# ==================== TEST BOOKINGS ====================

@router.post("/tests", response_model=TestBookingResponse)
async def create_test_booking(
    test_data: TestBookingCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new test booking. Max 3 tests allowed at a time."""
    user_id = current_user.get("id")
    
    # Check if user already has 3 pending/confirmed tests
    result = await db.execute(
        select(func.count(TestBooking.id)).where(
            and_(
                TestBooking.user_id == UUID(user_id),
                TestBooking.status.in_(["pending", "confirmed"])
            )
        )
    )
    active_tests = result.scalar() or 0
    
    if active_tests >= 3:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You can only book a maximum of 3 tests at a time. Please complete or cancel existing tests."
        )
    
    # Create new test booking
    test_booking = TestBooking(
        user_id=UUID(user_id),
        test_name=test_data.test_name,
        test_type=test_data.test_type,
        booking_date=datetime.fromisoformat(test_data.booking_date),
        notes=test_data.notes,
        status="pending"
    )
    
    db.add(test_booking)
    await db.commit()
    await db.refresh(test_booking)
    
    return test_booking


@router.get("/tests", response_model=List[TestBookingResponse])
async def get_test_bookings(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all test bookings for current user."""
    user_id = current_user.get("id")
    
    result = await db.execute(
        select(TestBooking).where(TestBooking.user_id == UUID(user_id))
        .order_by(TestBooking.booking_date.desc())
    )
    
    return result.scalars().all()


@router.get("/tests/{booking_id}", response_model=TestBookingResponse)
async def get_test_booking(
    booking_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get specific test booking."""
    user_id = current_user.get("id")
    
    result = await db.execute(
        select(TestBooking).where(
            and_(
                TestBooking.id == UUID(booking_id),
                TestBooking.user_id == UUID(user_id)
            )
        )
    )
    
    booking = result.scalar_one_or_none()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Test booking not found"
        )
    
    return booking


@router.put("/tests/{booking_id}", response_model=TestBookingResponse)
async def update_test_booking(
    booking_id: str,
    test_data: TestBookingUpdate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update test booking."""
    user_id = current_user.get("id")
    
    result = await db.execute(
        select(TestBooking).where(
            and_(
                TestBooking.id == UUID(booking_id),
                TestBooking.user_id == UUID(user_id)
            )
        )
    )
    
    booking = result.scalar_one_or_none()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Test booking not found"
        )
    
    # Update fields
    for field, value in test_data.model_dump(exclude_unset=True).items():
        if value is not None:
            if field == "booking_date":
                setattr(booking, field, datetime.fromisoformat(value))
            else:
                setattr(booking, field, value)
    
    await db.commit()
    await db.refresh(booking)
    
    return booking


@router.delete("/tests/{booking_id}")
async def delete_test_booking(
    booking_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Cancel test booking."""
    user_id = current_user.get("id")
    
    result = await db.execute(
        select(TestBooking).where(
            and_(
                TestBooking.id == UUID(booking_id),
                TestBooking.user_id == UUID(user_id)
            )
        )
    )
    
    booking = result.scalar_one_or_none()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Test booking not found"
        )
    
    # Mark as cancelled instead of deleting
    booking.status = "cancelled"
    await db.commit()
    
    return {"message": "Test booking cancelled"}


# ==================== DOCTOR APPOINTMENTS ====================

@router.post("/doctors", response_model=DoctorAppointmentResponse)
async def create_doctor_appointment(
    appointment_data: DoctorAppointmentCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new doctor appointment. Patient cannot have duplicate slot bookings."""
    patient_id = current_user.get("id")
    doctor_id = str(appointment_data.doctor_id)
    appointment_date = datetime.fromisoformat(appointment_data.appointment_date).date()
    
    # Check if patient already has a booking with this doctor for the same date and time
    result = await db.execute(
        select(func.count(DoctorAppointment.id)).where(
            and_(
                DoctorAppointment.patient_id == UUID(patient_id),
                DoctorAppointment.doctor_id == UUID(doctor_id),
                func.date(DoctorAppointment.appointment_date) == appointment_date,
                DoctorAppointment.appointment_time == appointment_data.appointment_time,
                DoctorAppointment.status.in_(["pending", "confirmed"])
            )
        )
    )
    
    existing_booking = result.scalar() or 0
    
    if existing_booking > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You already have a booking with this doctor for the same date and time."
        )
    
    # Create new appointment
    appointment = DoctorAppointment(
        patient_id=UUID(patient_id),
        doctor_id=UUID(doctor_id),
        appointment_date=datetime.fromisoformat(appointment_data.appointment_date),
        appointment_time=appointment_data.appointment_time,
        reason=appointment_data.reason,
        notes=appointment_data.notes,
        status="pending"
    )
    
    db.add(appointment)
    await db.commit()
    await db.refresh(appointment)
    
    return appointment


@router.get("/doctors", response_model=List[DoctorAppointmentResponse])
async def get_doctor_appointments(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all doctor appointments for current user."""
    user_id = current_user.get("id")
    
    result = await db.execute(
        select(DoctorAppointment).where(DoctorAppointment.patient_id == UUID(user_id))
        .order_by(DoctorAppointment.appointment_date.desc())
    )
    
    return result.scalars().all()


@router.get("/doctors/{appointment_id}", response_model=DoctorAppointmentResponse)
async def get_doctor_appointment(
    appointment_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get specific doctor appointment."""
    user_id = current_user.get("id")
    
    result = await db.execute(
        select(DoctorAppointment).where(
            and_(
                DoctorAppointment.id == UUID(appointment_id),
                DoctorAppointment.patient_id == UUID(user_id)
            )
        )
    )
    
    appointment = result.scalar_one_or_none()
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor appointment not found"
        )
    
    return appointment


@router.put("/doctors/{appointment_id}", response_model=DoctorAppointmentResponse)
async def update_doctor_appointment(
    appointment_id: str,
    appointment_data: DoctorAppointmentUpdate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update doctor appointment."""
    user_id = current_user.get("id")
    
    result = await db.execute(
        select(DoctorAppointment).where(
            and_(
                DoctorAppointment.id == UUID(appointment_id),
                DoctorAppointment.patient_id == UUID(user_id)
            )
        )
    )
    
    appointment = result.scalar_one_or_none()
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor appointment not found"
        )
    
    # Update fields
    for field, value in appointment_data.model_dump(exclude_unset=True).items():
        if value is not None:
            if field == "appointment_date":
                setattr(appointment, field, datetime.fromisoformat(value))
            else:
                setattr(appointment, field, value)
    
    await db.commit()
    await db.refresh(appointment)
    
    return appointment


@router.delete("/doctors/{appointment_id}")
async def cancel_doctor_appointment(
    appointment_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Cancel doctor appointment."""
    user_id = current_user.get("id")
    
    result = await db.execute(
        select(DoctorAppointment).where(
            and_(
                DoctorAppointment.id == UUID(appointment_id),
                DoctorAppointment.patient_id == UUID(user_id)
            )
        )
    )
    
    appointment = result.scalar_one_or_none()
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor appointment not found"
        )
    
    # Mark as cancelled instead of deleting
    appointment.status = "cancelled"
    await db.commit()
    
    return {"message": "Doctor appointment cancelled"}


# ==================== DOCTOR-SPECIFIC ENDPOINTS ====================

@router.get("/doctors/my-appointments", response_model=List[DoctorAppointmentResponse])
async def get_my_appointments(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all appointments for the current doctor"""
    doctor_id = current_user.get("id")
    
    result = await db.execute(
        select(DoctorAppointment).where(
            DoctorAppointment.doctor_id == UUID(doctor_id)
        ).order_by(DoctorAppointment.appointment_date.desc())
    )
    
    appointments = result.scalars().all()
    return appointments

