"""
Health data endpoints (steps, water intake, etc.)
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from datetime import datetime, date
from uuid import UUID as PyUUID

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.medical import DailyHealth
from pydantic import BaseModel

router = APIRouter()


# ==================== Schemas ====================

class DailyHealthCreate(BaseModel):
    """Schema for creating/updating daily health."""
    date: Optional[str] = None
    steps: Optional[int] = None
    steps_goal: Optional[int] = None
    water_intake: Optional[int] = None
    water_goal: Optional[int] = None
    sleep_hours: Optional[float] = None
    weight: Optional[float] = None
    notes: Optional[str] = None


class StepsUpdate(BaseModel):
    """Schema for updating steps."""
    steps: int
    date: Optional[str] = None


class WaterUpdate(BaseModel):
    """Schema for updating water intake."""
    glasses: int
    date: Optional[str] = None


# ==================== Endpoints ====================

@router.get("/daily")
async def get_daily_health(
    date_str: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get daily health data for a specific date or today."""
    user_id = current_user.get("id")
    
    if date_str:
        target_date = datetime.strptime(date_str, "%Y-%m-%d").date()
    else:
        target_date = date.today()
    
    result = await db.execute(
        select(DailyHealth).where(
            DailyHealth.user_id == PyUUID(user_id),
            func.date(DailyHealth.date) == target_date
        )
    )
    health = result.scalar_one_or_none()
    
    if not health:
        return {
            "date": str(target_date),
            "steps": 0,
            "steps_goal": 10000,
            "water_intake": 0,
            "water_goal": 8,
            "sleep_hours": 0,
            "weight": None,
            "notes": None
        }
    
    return {
        "id": str(health.id),
        "date": str(target_date),
        "steps": health.steps,
        "steps_goal": health.steps_goal,
        "water_intake": health.water_intake,
        "water_goal": health.water_goal,
        "sleep_hours": health.sleep_hours,
        "weight": health.weight,
        "notes": health.notes
    }


@router.post("/daily")
async def update_daily_health(
    data: DailyHealthCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update daily health data."""
    user_id = PyUUID(current_user.get("id"))
    
    if data.date:
        target_date = datetime.strptime(data.date, "%Y-%m-%d")
    else:
        target_date = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    
    result = await db.execute(
        select(DailyHealth).where(
            DailyHealth.user_id == user_id,
            func.date(DailyHealth.date) == target_date.date()
        )
    )
    health = result.scalar_one_or_none()
    
    if health:
        # Update existing
        if data.steps is not None:
            health.steps = data.steps
        if data.steps_goal is not None:
            health.steps_goal = data.steps_goal
        if data.water_intake is not None:
            health.water_intake = data.water_intake
        if data.water_goal is not None:
            health.water_goal = data.water_goal
        if data.sleep_hours is not None:
            health.sleep_hours = data.sleep_hours
        if data.weight is not None:
            health.weight = data.weight
        if data.notes is not None:
            health.notes = data.notes
    else:
        # Create new
        health = DailyHealth(
            user_id=user_id,
            date=target_date,
            steps=data.steps or 0,
            steps_goal=data.steps_goal or 10000,
            water_intake=data.water_intake or 0,
            water_goal=data.water_goal or 8,
            sleep_hours=data.sleep_hours or 0,
            weight=data.weight,
            notes=data.notes
        )
        db.add(health)
    
    await db.commit()
    
    return {"message": "Daily health updated"}


@router.post("/steps")
async def update_steps(
    data: StepsUpdate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update step count."""
    user_id = PyUUID(current_user.get("id"))
    
    if data.date:
        target_date = datetime.strptime(data.date, "%Y-%m-%d")
    else:
        target_date = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    
    result = await db.execute(
        select(DailyHealth).where(
            DailyHealth.user_id == user_id,
            func.date(DailyHealth.date) == target_date.date()
        )
    )
    health = result.scalar_one_or_none()
    
    if health:
        health.steps = data.steps
    else:
        health = DailyHealth(
            user_id=user_id,
            date=target_date,
            steps=data.steps
        )
        db.add(health)
    
    await db.commit()
    
    return {"message": "Steps updated", "steps": data.steps}


@router.post("/water")
async def update_water_intake(
    data: WaterUpdate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update water intake."""
    user_id = PyUUID(current_user.get("id"))
    
    if data.date:
        target_date = datetime.strptime(data.date, "%Y-%m-%d")
    else:
        target_date = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    
    result = await db.execute(
        select(DailyHealth).where(
            DailyHealth.user_id == user_id,
            func.date(DailyHealth.date) == target_date.date()
        )
    )
    health = result.scalar_one_or_none()
    
    if health:
        health.water_intake = data.glasses
    else:
        health = DailyHealth(
            user_id=user_id,
            date=target_date,
            water_intake=data.glasses
        )
        db.add(health)
    
    await db.commit()
    
    return {"message": "Water intake updated", "glasses": data.glasses}


@router.get("/history")
async def get_health_history(
    days: int = 7,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get health history for the past N days."""
    user_id = current_user.get("id")
    
    from datetime import timedelta
    
    start_date = datetime.utcnow() - timedelta(days=days)
    
    result = await db.execute(
        select(DailyHealth)
        .where(
            DailyHealth.user_id == PyUUID(user_id),
            DailyHealth.date >= start_date
        )
        .order_by(DailyHealth.date.desc())
    )
    history = result.scalars().all()
    
    return [
        {
            "date": str(h.date.date()),
            "steps": h.steps,
            "steps_goal": h.steps_goal,
            "water_intake": h.water_intake,
            "water_goal": h.water_goal,
            "sleep_hours": h.sleep_hours,
            "weight": h.weight
        }
        for h in history
    ]
