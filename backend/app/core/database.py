"""
Database configuration and session management
Supports both PostgreSQL (production) and SQLite (development)
"""

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from typing import AsyncGenerator
import os

from app.core.config import settings

# Base class for models
Base = declarative_base()

# Determine database URL - use SQLite if PostgreSQL not configured or for easy dev
def get_database_url() -> str:
    """Get database URL, defaulting to SQLite for easy local development."""
    db_url = settings.DATABASE_URL
    
    # If using default PostgreSQL URL or it contains 'password', use SQLite instead
    if 'postgresql' in db_url and ('password@localhost' in db_url or 'postgres:password' in db_url):
        # Use SQLite for local development
        sqlite_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'dietec.db')
        print(f"⚠️  Using SQLite database at: {sqlite_path}")
        return f"sqlite+aiosqlite:///{sqlite_path}"
    
    return db_url

DATABASE_URL = get_database_url()

# Create async engine with appropriate settings
if DATABASE_URL.startswith('sqlite'):
    # SQLite settings
    engine = create_async_engine(
        DATABASE_URL,
        echo=settings.DEBUG,
        connect_args={"check_same_thread": False}
    )
else:
    # PostgreSQL settings
    engine = create_async_engine(
        DATABASE_URL,
        echo=settings.DEBUG,
        pool_pre_ping=True,
        pool_size=5,
        max_overflow=10
    )

# Session factory
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)


async def init_db():
    """Initialize database tables."""
    try:
        async with engine.begin() as conn:
            # Import all models here to ensure they're registered
            from app.models import user, medical  # noqa
            from app.api.endpoints.health import DailyHealth  # noqa
            await conn.run_sync(Base.metadata.create_all)
        print("✅ Database initialized successfully")
    except Exception as e:
        print(f"⚠️  Database initialization warning: {e}")
        print("   The app will run but database features may be limited.")


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency to get database session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
