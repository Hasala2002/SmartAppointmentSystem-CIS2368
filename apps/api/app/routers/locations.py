from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.location import Location
from app.schemas.location import LocationResponse

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
