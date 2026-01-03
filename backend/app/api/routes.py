"""
Main API router that includes all sub-routers
"""

from fastapi import APIRouter

from app.api.endpoints import auth, users, medical, chat, health

router = APIRouter()

# Include all endpoint routers
router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
router.include_router(users.router, prefix="/users", tags=["Users"])
router.include_router(medical.router, prefix="/medical", tags=["Medical History"])
router.include_router(chat.router, prefix="/chat", tags=["AI Chat"])
router.include_router(health.router, prefix="/health", tags=["Health Data"])
