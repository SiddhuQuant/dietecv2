"""
Medical history endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from typing import List, Optional
from uuid import UUID

from app.core.database import get_db
from app.core.security import get_current_user
from app.schemas.medical import (
    MedicalConditionCreate,
    MedicalConditionUpdate,
    MedicalConditionResponse,
    AllergyCreate,
    AllergyUpdate,
    AllergyResponse,
    SkinProblemCreate,
    SkinProblemUpdate,
    SkinProblemResponse,
    BasicInfoCreate,
    BasicInfoUpdate,
    BasicInfoResponse
)
from app.models.medical import MedicalCondition, Allergy, SkinProblem, BasicInfo

router = APIRouter()


# ==================== Basic Info ====================

@router.get("/basic-info", response_model=Optional[dict])
async def get_basic_info(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get basic medical info."""
    user_id = current_user.get("id")
    
    result = await db.execute(
        select(BasicInfo).where(BasicInfo.user_id == UUID(user_id))
    )
    info = result.scalar_one_or_none()
    
    if not info:
        return None
    
    return {
        "id": str(info.id),
        "age": info.age,
        "gender": info.gender,
        "bloodType": info.blood_type,
        "height": info.height,
        "weight": info.weight,
        "emergencyContact": info.emergency_contact
    }


@router.post("/basic-info", response_model=dict)
async def create_or_update_basic_info(
    data: BasicInfoCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create or update basic medical info."""
    user_id = UUID(current_user.get("id"))
    
    result = await db.execute(
        select(BasicInfo).where(BasicInfo.user_id == user_id)
    )
    info = result.scalar_one_or_none()
    
    if info:
        # Update existing
        info.age = data.age
        info.gender = data.gender
        info.blood_type = data.blood_type
        info.height = data.height
        info.weight = data.weight
        info.emergency_contact = data.emergency_contact
    else:
        # Create new
        info = BasicInfo(
            user_id=user_id,
            age=data.age,
            gender=data.gender,
            blood_type=data.blood_type,
            height=data.height,
            weight=data.weight,
            emergency_contact=data.emergency_contact
        )
        db.add(info)
    
    await db.commit()
    return {"message": "Basic info saved successfully"}


# ==================== Medical Conditions ====================

@router.get("/conditions", response_model=List[dict])
async def get_conditions(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all medical conditions."""
    user_id = current_user.get("id")
    
    result = await db.execute(
        select(MedicalCondition).where(MedicalCondition.user_id == UUID(user_id))
    )
    conditions = result.scalars().all()
    
    return [
        {
            "id": str(c.id),
            "name": c.name,
            "diagnosedDate": str(c.diagnosed_date) if c.diagnosed_date else "",
            "severity": c.severity.value if c.severity else "mild",
            "notes": c.notes
        }
        for c in conditions
    ]


@router.post("/conditions", response_model=dict)
async def create_condition(
    data: MedicalConditionCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a medical condition."""
    user_id = UUID(current_user.get("id"))
    
    condition = MedicalCondition(
        user_id=user_id,
        name=data.name,
        severity=data.severity,
        notes=data.notes
    )
    
    db.add(condition)
    await db.commit()
    await db.refresh(condition)
    
    return {"message": "Condition created", "id": str(condition.id)}


@router.post("/conditions/bulk", response_model=dict)
async def save_conditions_bulk(
    conditions: List[MedicalConditionCreate],
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Save multiple conditions (replaces existing)."""
    user_id = UUID(current_user.get("id"))
    
    # Delete existing conditions
    await db.execute(
        delete(MedicalCondition).where(MedicalCondition.user_id == user_id)
    )
    
    # Add new conditions
    for data in conditions:
        condition = MedicalCondition(
            user_id=user_id,
            name=data.name,
            severity=data.severity,
            notes=data.notes
        )
        db.add(condition)
    
    await db.commit()
    return {"message": f"Saved {len(conditions)} conditions"}


@router.delete("/conditions/{condition_id}")
async def delete_condition(
    condition_id: UUID,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a medical condition."""
    user_id = UUID(current_user.get("id"))
    
    result = await db.execute(
        select(MedicalCondition).where(
            MedicalCondition.id == condition_id,
            MedicalCondition.user_id == user_id
        )
    )
    condition = result.scalar_one_or_none()
    
    if not condition:
        raise HTTPException(status_code=404, detail="Condition not found")
    
    await db.delete(condition)
    await db.commit()
    
    return {"message": "Condition deleted"}


# ==================== Allergies ====================

@router.get("/allergies", response_model=List[dict])
async def get_allergies(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all allergies."""
    user_id = current_user.get("id")
    
    result = await db.execute(
        select(Allergy).where(Allergy.user_id == UUID(user_id))
    )
    allergies = result.scalars().all()
    
    return [
        {
            "id": str(a.id),
            "allergen": a.allergen,
            "type": a.allergy_type,
            "severity": a.severity.value if a.severity else "mild",
            "symptoms": a.symptoms or [],
            "notes": a.notes
        }
        for a in allergies
    ]


@router.post("/allergies", response_model=dict)
async def create_allergy(
    data: AllergyCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create an allergy."""
    user_id = UUID(current_user.get("id"))
    
    allergy = Allergy(
        user_id=user_id,
        allergen=data.allergen,
        allergy_type=data.allergy_type,
        severity=data.severity,
        symptoms=data.symptoms,
        notes=data.notes
    )
    
    db.add(allergy)
    await db.commit()
    await db.refresh(allergy)
    
    return {"message": "Allergy created", "id": str(allergy.id)}


@router.post("/allergies/bulk", response_model=dict)
async def save_allergies_bulk(
    allergies: List[AllergyCreate],
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Save multiple allergies (replaces existing)."""
    user_id = UUID(current_user.get("id"))
    
    # Delete existing allergies
    await db.execute(
        delete(Allergy).where(Allergy.user_id == user_id)
    )
    
    # Add new allergies
    for data in allergies:
        allergy = Allergy(
            user_id=user_id,
            allergen=data.allergen,
            allergy_type=data.allergy_type,
            severity=data.severity,
            symptoms=data.symptoms,
            notes=data.notes
        )
        db.add(allergy)
    
    await db.commit()
    return {"message": f"Saved {len(allergies)} allergies"}


@router.delete("/allergies/{allergy_id}")
async def delete_allergy(
    allergy_id: UUID,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete an allergy."""
    user_id = UUID(current_user.get("id"))
    
    result = await db.execute(
        select(Allergy).where(
            Allergy.id == allergy_id,
            Allergy.user_id == user_id
        )
    )
    allergy = result.scalar_one_or_none()
    
    if not allergy:
        raise HTTPException(status_code=404, detail="Allergy not found")
    
    await db.delete(allergy)
    await db.commit()
    
    return {"message": "Allergy deleted"}


# ==================== Skin Problems ====================

@router.get("/skin-problems", response_model=List[dict])
async def get_skin_problems(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all skin problems."""
    user_id = current_user.get("id")
    
    result = await db.execute(
        select(SkinProblem).where(SkinProblem.user_id == UUID(user_id))
    )
    problems = result.scalars().all()
    
    return [
        {
            "id": str(p.id),
            "condition": p.condition,
            "bodyPart": p.body_part,
            "severity": p.severity.value if p.severity else "mild",
            "duration": p.duration,
            "treatment": p.treatment,
            "notes": p.notes
        }
        for p in problems
    ]


@router.post("/skin-problems", response_model=dict)
async def create_skin_problem(
    data: SkinProblemCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a skin problem."""
    user_id = UUID(current_user.get("id"))
    
    problem = SkinProblem(
        user_id=user_id,
        condition=data.condition,
        body_part=data.body_part,
        severity=data.severity,
        duration=data.duration,
        treatment=data.treatment,
        notes=data.notes
    )
    
    db.add(problem)
    await db.commit()
    await db.refresh(problem)
    
    return {"message": "Skin problem created", "id": str(problem.id)}


@router.post("/skin-problems/bulk", response_model=dict)
async def save_skin_problems_bulk(
    problems: List[SkinProblemCreate],
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Save multiple skin problems (replaces existing)."""
    user_id = UUID(current_user.get("id"))
    
    # Delete existing problems
    await db.execute(
        delete(SkinProblem).where(SkinProblem.user_id == user_id)
    )
    
    # Add new problems
    for data in problems:
        problem = SkinProblem(
            user_id=user_id,
            condition=data.condition,
            body_part=data.body_part,
            severity=data.severity,
            duration=data.duration,
            treatment=data.treatment,
            notes=data.notes
        )
        db.add(problem)
    
    await db.commit()
    return {"message": f"Saved {len(problems)} skin problems"}


@router.delete("/skin-problems/{problem_id}")
async def delete_skin_problem(
    problem_id: UUID,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a skin problem."""
    user_id = UUID(current_user.get("id"))
    
    result = await db.execute(
        select(SkinProblem).where(
            SkinProblem.id == problem_id,
            SkinProblem.user_id == user_id
        )
    )
    problem = result.scalar_one_or_none()
    
    if not problem:
        raise HTTPException(status_code=404, detail="Skin problem not found")
    
    await db.delete(problem)
    await db.commit()
    
    return {"message": "Skin problem deleted"}
