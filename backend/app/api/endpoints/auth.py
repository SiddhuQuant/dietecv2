"""
Authentication endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import timedelta

from app.core.database import get_db
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    verify_supabase_token
)
from app.core.config import settings
from app.schemas.user import UserCreate, UserLogin, Token, UserResponse
from app.models.user import User
from sqlalchemy import select

router = APIRouter()


@router.post("/register", response_model=Token)
async def register(
    user_data: UserCreate,
    db: AsyncSession = Depends(get_db)
):
    """Register a new user."""
    # Check if user exists
    result = await db.execute(select(User).where(User.email == user_data.email))
    existing_user = result.scalar_one_or_none()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        email=user_data.email,
        hashed_password=hashed_password,
        full_name=user_data.full_name,
        phone=user_data.phone
    )
    
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    # Create access token
    access_token = create_access_token(
        data={"sub": str(new_user.id), "email": new_user.email},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return Token(access_token=access_token)


@router.post("/login", response_model=Token)
async def login(
    credentials: UserLogin,
    db: AsyncSession = Depends(get_db)
):
    """Login with email and password."""
    # Find user
    result = await db.execute(select(User).where(User.email == credentials.email))
    user = result.scalar_one_or_none()
    
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return Token(access_token=access_token)


@router.post("/verify-supabase", response_model=dict)
async def verify_supabase(token: str):
    """Verify a Supabase token and return user info."""
    user_info = await verify_supabase_token(token)
    return user_info


@router.post("/sync-supabase-user")
async def sync_supabase_user(
    supabase_user: dict,
    db: AsyncSession = Depends(get_db)
):
    """Sync a Supabase user to local database."""
    email = supabase_user.get("email")
    supabase_id = supabase_user.get("id")
    
    if not email or not supabase_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user data"
        )
    
    # Check if user exists
    result = await db.execute(
        select(User).where(
            (User.email == email) | (User.supabase_id == supabase_id)
        )
    )
    user = result.scalar_one_or_none()
    
    if user:
        # Update supabase_id if needed
        if not user.supabase_id:
            user.supabase_id = supabase_id
            await db.commit()
        return {"message": "User synced", "user_id": str(user.id)}
    
    # Create new user
    new_user = User(
        email=email,
        supabase_id=supabase_id,
        full_name=supabase_user.get("user_metadata", {}).get("name")
    )
    
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    return {"message": "User created", "user_id": str(new_user.id)}
