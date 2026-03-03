from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from datetime import datetime
import uuid
from app.database import get_db
from app.core.dependencies import get_current_user, get_current_staff_user
from app.core.security import hash_password
from app.models.user import User, UserRole
from app.models.staff import Staff
from app.models.location import Location
from app.schemas.user import UserResponse, CreateStaffRequest

router = APIRouter(prefix="/api/v1/users", tags=["users"])


@router.get("/profile", response_model=UserResponse)
async def get_profile(user: User = Depends(get_current_user)):
    return UserResponse.from_orm(user)


@router.post("/staff", response_model=UserResponse)
async def create_staff_user(
    request: CreateStaffRequest,
    _: User = Depends(get_current_staff_user),
    db: AsyncSession = Depends(get_db)
):
    if request.has_global_access and request.location_id is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Global staff must not have a location_id"
        )

    if not request.has_global_access and request.location_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Location-scoped staff must include location_id"
        )
    existing_user_result = await db.execute(select(User).where(User.email == request.email))
    existing_user = existing_user_result.scalar_one_or_none()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    if request.location_id:
        location_result = await db.execute(select(Location).where(Location.id == request.location_id))
        location = location_result.scalar_one_or_none()
        if not location:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Location not found"
            )

    user = User(
        id=uuid.uuid4(),
        email=request.email,
        password_hash=hash_password(request.password),
        first_name=request.first_name,
        last_name=request.last_name,
        phone=request.phone,
        date_of_birth=request.date_of_birth,
        has_dental_insurance=request.has_dental_insurance,
        role=UserRole.staff,
        is_active=True,
        email_verified=True
    )
    db.add(user)
    await db.flush()

    staff = Staff(
        id=uuid.uuid4(),
        user_id=user.id,
        location_id=request.location_id,
        is_admin=request.is_admin,
        has_global_access=request.has_global_access,
        created_at=datetime.utcnow()
    )
    db.add(staff)

    try:
        await db.commit()
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid staff scope configuration"
        )

    await db.refresh(user)
    return UserResponse.from_orm(user)
