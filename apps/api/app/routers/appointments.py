from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime
import uuid
from app.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.appointment import Appointment, AppointmentStatus
from app.models.location import Location
from app.schemas.appointment import (
    CreateAppointmentRequest,
    AppointmentResponse,
    RescheduleRequest,
    CancelRequest
)

router = APIRouter(prefix="/api/v1/appointments", tags=["appointments"])


@router.post("/", response_model=AppointmentResponse)
async def create_appointment(
    request: CreateAppointmentRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new appointment"""
    # Verify location exists
    result = await db.execute(select(Location).where(Location.id == request.location_id))
    location = result.scalar_one_or_none()
    
    if not location or not location.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Location not found"
        )
    
    # Check for conflicts
    result = await db.execute(
        select(Appointment).where(
            (Appointment.location_id == request.location_id) &
            (Appointment.scheduled_start == request.scheduled_start) &
            (Appointment.status.notin_([AppointmentStatus.cancelled, AppointmentStatus.no_show]))
        )
    )
    conflict = result.scalar_one_or_none()
    
    if conflict:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Time slot is not available"
        )
    
    # Create appointment
    appointment = Appointment(
        id=uuid.uuid4(),
        location_id=request.location_id,
        customer_id=current_user.id,
        scheduled_start=request.scheduled_start,
        scheduled_end=request.scheduled_end,
        status=AppointmentStatus.pending,
        notes=request.notes
    )
    
    db.add(appointment)
    await db.commit()
    await db.refresh(appointment)
    
    return AppointmentResponse.from_orm(appointment)


@router.get("/", response_model=list[AppointmentResponse])
async def list_appointments(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """List appointments for current user"""
    result = await db.execute(
        select(Appointment).where(Appointment.customer_id == current_user.id)
    )
    appointments = result.scalars().all()
    return [AppointmentResponse.from_orm(appt) for appt in appointments]


@router.get("/{appointment_id}", response_model=AppointmentResponse)
async def get_appointment(
    appointment_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get appointment details"""
    result = await db.execute(select(Appointment).where(Appointment.id == appointment_id))
    appointment = result.scalar_one_or_none()
    
    if not appointment or appointment.customer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found"
        )
    
    return AppointmentResponse.from_orm(appointment)


@router.patch("/{appointment_id}/reschedule", response_model=AppointmentResponse)
async def reschedule_appointment(
    appointment_id: str,
    request: RescheduleRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Reschedule an appointment"""
    result = await db.execute(select(Appointment).where(Appointment.id == appointment_id))
    appointment = result.scalar_one_or_none()
    
    if not appointment or appointment.customer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found"
        )
    
    if appointment.status not in [AppointmentStatus.pending, AppointmentStatus.confirmed]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot reschedule appointment in current status"
        )
    
    # Check for conflicts
    result = await db.execute(
        select(Appointment).where(
            (Appointment.location_id == appointment.location_id) &
            (Appointment.scheduled_start == request.scheduled_start) &
            (Appointment.id != appointment_id) &
            (Appointment.status.notin_([AppointmentStatus.cancelled, AppointmentStatus.no_show]))
        )
    )
    conflict = result.scalar_one_or_none()
    
    if conflict:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Time slot is not available"
        )
    
    # Update appointment
    appointment.scheduled_start = request.scheduled_start
    appointment.scheduled_end = request.scheduled_end
    
    await db.commit()
    await db.refresh(appointment)
    
    return AppointmentResponse.from_orm(appointment)


@router.patch("/{appointment_id}/cancel", response_model=AppointmentResponse)
async def cancel_appointment(
    appointment_id: str,
    request: CancelRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Cancel an appointment"""
    result = await db.execute(select(Appointment).where(Appointment.id == appointment_id))
    appointment = result.scalar_one_or_none()
    
    if not appointment or appointment.customer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found"
        )
    
    if appointment.status == AppointmentStatus.cancelled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Appointment is already cancelled"
        )
    
    if appointment.status in [AppointmentStatus.completed, AppointmentStatus.in_progress]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot cancel appointment in current status"
        )
    
    appointment.status = AppointmentStatus.cancelled
    appointment.cancellation_reason = request.reason
    
    await db.commit()
    await db.refresh(appointment)
    
    return AppointmentResponse.from_orm(appointment)
