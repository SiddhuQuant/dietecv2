"""
User profile endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional
from uuid import UUID

from app.core.database import get_db
from app.core.security import get_current_user
from app.schemas.user import (
    UserResponse,
    UserUpdate,
    UserProfileCreate,
    UserProfileUpdate,
    UserProfileResponse
)
from app.models.user import User, UserProfile

router = APIRouter()


@router.get("/me", response_model=dict)
async def get_current_user_info(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get current user information."""
    user_id = current_user.get("id")
    email = current_user.get("email")
    
    # Try to find user in database
    if user_id:
        result = await db.execute(select(User).where(User.id == UUID(user_id)))
    else:
        result = await db.execute(select(User).where(User.email == email))
    
    user = result.scalar_one_or_none()
    
    if not user:
        # Return basic info from token
        return {
            "id": user_id,
            "email": email,
            "is_profile_complete": False
        }
    
    return {
        "id": str(user.id),
        "email": user.email,
        "full_name": user.full_name,
        "phone": user.phone,
        "is_profile_complete": user.is_profile_complete
    }


@router.put("/me", response_model=dict)
async def update_current_user(
    user_data: UserUpdate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update current user information."""
    user_id = current_user.get("id")
    
    result = await db.execute(select(User).where(User.id == UUID(user_id)))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Update fields
    for field, value in user_data.model_dump(exclude_unset=True).items():
        setattr(user, field, value)
    
    await db.commit()
    await db.refresh(user)
    
    return {"message": "User updated successfully"}


@router.get("/profile", response_model=Optional[dict])
async def get_user_profile(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get user profile."""
    user_id = current_user.get("id")
    email = current_user.get("email")
    
    # Find user
    if user_id:
        user_result = await db.execute(select(User).where(User.id == UUID(user_id)))
    else:
        user_result = await db.execute(select(User).where(User.email == email))
    
    user = user_result.scalar_one_or_none()
    
    if not user:
        return None
    
    # Get profile
    profile_result = await db.execute(
        select(UserProfile).where(UserProfile.user_id == user.id)
    )
    profile = profile_result.scalar_one_or_none()
    
    if not profile:
        return None
    
    return {
        "fullName": user.full_name,
        "dateOfBirth": str(user.date_of_birth) if user.date_of_birth else "",
        "gender": user.gender,
        "phone": user.phone,
        "address": user.address,
        "bloodGroup": profile.blood_group,
        "height": profile.height,
        "weight": profile.weight,
        "allergies": profile.allergies,
        "chronicConditions": profile.chronic_conditions,
        "currentMedications": profile.current_medications,
        "emergencyContact": profile.emergency_contact_name,
        "emergencyPhone": profile.emergency_contact_phone,
        "emergencyRelation": profile.emergency_contact_relation
    }


@router.post("/profile", response_model=dict)
async def create_or_update_profile(
    profile_data: UserProfileCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create or update user profile."""
    user_id = current_user.get("id")
    email = current_user.get("email")
    
    # Find or create user
    if user_id:
        user_result = await db.execute(select(User).where(User.id == UUID(user_id)))
    else:
        user_result = await db.execute(select(User).where(User.email == email))
    
    user = user_result.scalar_one_or_none()
    
    if not user:
        # Create user if doesn't exist (for Supabase auth)
        user = User(
            email=email,
            full_name=profile_data.full_name,
            phone=profile_data.phone,
            gender=profile_data.gender,
            address=profile_data.address
        )
        db.add(user)
        await db.flush()
    else:
        # Update user info
        user.full_name = profile_data.full_name
        user.phone = profile_data.phone
        user.gender = profile_data.gender
        user.address = profile_data.address
    
    user.is_profile_complete = True
    
    # Check for existing profile
    profile_result = await db.execute(
        select(UserProfile).where(UserProfile.user_id == user.id)
    )
    profile = profile_result.scalar_one_or_none()
    
    if profile:
        # Update existing profile
        profile.blood_group = profile_data.blood_group
        profile.height = profile_data.height
        profile.weight = profile_data.weight
        profile.allergies = profile_data.allergies
        profile.chronic_conditions = profile_data.chronic_conditions
        profile.current_medications = profile_data.current_medications
        profile.emergency_contact_name = profile_data.emergency_contact_name
        profile.emergency_contact_phone = profile_data.emergency_contact_phone
        profile.emergency_contact_relation = profile_data.emergency_contact_relation
    else:
        # Create new profile
        profile = UserProfile(
            user_id=user.id,
            blood_group=profile_data.blood_group,
            height=profile_data.height,
            weight=profile_data.weight,
            allergies=profile_data.allergies,
            chronic_conditions=profile_data.chronic_conditions,
            current_medications=profile_data.current_medications,
            emergency_contact_name=profile_data.emergency_contact_name,
            emergency_contact_phone=profile_data.emergency_contact_phone,
            emergency_contact_relation=profile_data.emergency_contact_relation
        )
        db.add(profile)
    
    await db.commit()
    
    return {"message": "Profile saved successfully"}


@router.get("/profile/complete", response_model=dict)
async def check_profile_complete(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Check if user has completed their profile."""
    user_id = current_user.get("id")
    email = current_user.get("email")
    
    # Find user
    if user_id:
        result = await db.execute(select(User).where(User.id == UUID(user_id)))
    else:
        result = await db.execute(select(User).where(User.email == email))
    
    user = result.scalar_one_or_none()
    
    if not user:
        return {"is_complete": False}
    
    # Check for profile
    profile_result = await db.execute(
        select(UserProfile).where(UserProfile.user_id == user.id)
    )
    profile = profile_result.scalar_one_or_none()
    
    return {"is_complete": user.is_profile_complete and profile is not None}
