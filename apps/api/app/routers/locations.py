from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime
import uuid
from app.database import get_db
from app.core.dependencies import get_current_staff_user
from app.models.user import User
from app.models.location import Location
from app.schemas.location import LocationResponse, CreateLocationRequest

router = APIRouter(prefix="/api/v1/locations", tags=["locations"])


@router.get("/", response_model=list[LocationResponse])
async def list_locations(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Location).where(Location.is_active == True))
    locations = result.scalars().all()
    return [LocationResponse.from_orm(loc) for loc in locations]


@router.get("/{location_id}", response_model=LocationResponse)
async def get_location(location_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Location).where(Location.id == location_id))
    location = result.scalar_one_or_none()
    
    if not location or not location.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Location not found"
        )
    
    return LocationResponse.from_orm(location)


@router.post("/", response_model=LocationResponse)
async def create_location(
    request: CreateLocationRequest,
    _: User = Depends(get_current_staff_user),
    db: AsyncSession = Depends(get_db)
):
    existing_slug_result = await db.execute(select(Location).where(Location.slug == request.slug))
    existing_slug = existing_slug_result.scalar_one_or_none()
    if existing_slug:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Location slug already exists"
        )

    location = Location(
        id=uuid.uuid4(),
        name=request.name,
        slug=request.slug,
        address=request.address,
        city=request.city,
        state=request.state,
        zip_code=request.zip_code,
        phone=request.phone,
        timezone=request.timezone,
        appointment_duration_mins=request.appointment_duration_mins,
        buffer_mins=request.buffer_mins,
        is_active=request.is_active,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    db.add(location)
    await db.commit()
    await db.refresh(location)
    return LocationResponse.from_orm(location)


@router.get("/slug/{slug}", response_model=LocationResponse)
async def get_location_by_slug(slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Location).where(Location.slug == slug))
    location = result.scalar_one_or_none()
    
    if not location or not location.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Location not found"
        )
    
    return LocationResponse.from_orm(location)
