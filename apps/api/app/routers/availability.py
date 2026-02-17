from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timedelta
from app.database import get_db
from app.models.location import Location
from app.models.availability import Availability
from app.models.appointment import Appointment, AppointmentStatus
from app.schemas.availability import AvailableSlotsResponse, TimeSlot

router = APIRouter(prefix="/api/v1/availability", tags=["availability"])


@router.get("/slots", response_model=AvailableSlotsResponse)
async def get_available_slots(
    location_id: str,
    date: str,
    db: AsyncSession = Depends(get_db)
):
    """Get available time slots for a given location and date (YYYY-MM-DD format)"""
    try:
        slot_date = datetime.strptime(date, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid date format. Use YYYY-MM-DD"
        )
    
    # Get location
    result = await db.execute(select(Location).where(Location.id == location_id))
    location = result.scalar_one_or_none()
    
    if not location or not location.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Location not found"
        )
    
    # Get availability for day of week
    day_of_week = slot_date.weekday()
    result = await db.execute(
        select(Availability).where(
            (Availability.location_id == location_id) &
            (Availability.day_of_week == day_of_week) &
            (Availability.is_available == True)
        )
    )
    availability = result.scalars().all()
    
    if not availability:
        return AvailableSlotsResponse(location_id=location_id, date=date, slots=[])
    
    # Get booked appointments for this date
    slot_datetime_start = datetime.combine(slot_date, datetime.min.time())
    slot_datetime_end = datetime.combine(slot_date, datetime.max.time())
    
    result = await db.execute(
        select(Appointment).where(
            (Appointment.location_id == location_id) &
            (Appointment.scheduled_start >= slot_datetime_start) &
            (Appointment.scheduled_start <= slot_datetime_end) &
            (Appointment.status.notin_([AppointmentStatus.cancelled, AppointmentStatus.no_show]))
        )
    )
    booked_appointments = result.scalars().all()
    
    # Generate 15-minute slots
    slots = []
    duration_mins = location.appointment_duration_mins or 30
    buffer_mins = location.buffer_mins or 0
    
    for avail in availability:
        current_time = avail.start_time
        while current_time < avail.end_time:
            slot_start = datetime.combine(slot_date, current_time)
            slot_end = slot_start + timedelta(minutes=duration_mins)
            
            # Check for conflicts
            is_available = True
            for booking in booked_appointments:
                if not (slot_end <= booking.scheduled_start or slot_start >= booking.scheduled_end):
                    is_available = False
                    break
            
            if is_available:
                slots.append(TimeSlot(time=current_time.isoformat()))
            
            current_time = (datetime.combine(slot_date, current_time) + timedelta(minutes=15)).time()
    
    return AvailableSlotsResponse(location_id=location_id, date=date, slots=slots)
