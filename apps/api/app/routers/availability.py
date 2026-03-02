from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from datetime import datetime, timedelta, time
from uuid import UUID

from app.core.dependencies import get_current_staff_user
from app.database import get_db
from app.models.location import Location
from app.models.availability import Availability
from app.models.appointment import Appointment, AppointmentStatus
from app.models.user import User
from app.schemas.availability import (
    AvailableSlotsResponse,
    TimeSlot,
    SlotsByTimeOfDay,
    BulkCreateRequest,
    BulkCreateResponse,
    SeedDefaultsRequest,
    SeedDefaultsResponse,
)

router = APIRouter(prefix="/api/v1/availability", tags=["availability"])


def _parse_hhmm(value: str) -> time:
    try:
        return datetime.strptime(value, "%H:%M").time()
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid time format: {value}. Use HH:MM (24h)"
        )


def _categorize_slots(slots: list[TimeSlot]) -> SlotsByTimeOfDay:
    morning: list[TimeSlot] = []
    afternoon: list[TimeSlot] = []
    evening: list[TimeSlot] = []

    for slot in slots:
        hour = int(slot.start.split(":")[0])
        if hour < 12:
            morning.append(slot)
        elif hour < 17:
            afternoon.append(slot)
        else:
            evening.append(slot)

    return SlotsByTimeOfDay(morning=morning, afternoon=afternoon, evening=evening)


@router.post("/bulk-create", response_model=BulkCreateResponse)
async def bulk_create_availability(
    request: BulkCreateRequest,
    current_user: User = Depends(get_current_staff_user),
    db: AsyncSession = Depends(get_db),
):
    """Bulk create availability ranges for a location."""
    result = await db.execute(select(Location).where(Location.id == request.location_id))
    location = result.scalar_one_or_none()

    if not location or not location.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Location not found or inactive",
        )

    created_count = 0
    duplicates_skipped = 0

    for r in request.ranges:
        if r.day_of_week < 0 or r.day_of_week > 6:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"day_of_week must be 0-6, got {r.day_of_week}",
            )

        start_t = _parse_hhmm(r.start_time)
        end_t = _parse_hhmm(r.end_time)
        if end_t <= start_t:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="end_time must be after start_time",
            )

        dup_res = await db.execute(
            select(Availability).where(
                and_(
                    Availability.location_id == request.location_id,
                    Availability.day_of_week == r.day_of_week,
                    Availability.start_time == start_t,
                    Availability.end_time == end_t,
                )
            )
        )
        if dup_res.scalar_one_or_none() is not None:
            duplicates_skipped += 1
            continue

        db.add(
            Availability(
                location_id=request.location_id,
                day_of_week=r.day_of_week,
                start_time=start_t,
                end_time=end_t,
                is_available=True,
                created_at=datetime.utcnow(),
            )
        )
        created_count += 1

    await db.commit()
    return BulkCreateResponse(created_count=created_count, duplicates_skipped=duplicates_skipped)


@router.post("/seed-defaults", response_model=SeedDefaultsResponse)
async def seed_defaults(
    request: SeedDefaultsRequest,
    current_user: User = Depends(get_current_staff_user),
    db: AsyncSession = Depends(get_db),
):
    """Seed default availability (Mon-Fri) for a location."""
    result = await db.execute(select(Location).where(Location.id == request.location_id))
    location = result.scalar_one_or_none()

    if not location or not location.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Location not found or inactive",
        )

    if request.start_hour < 0 or request.start_hour > 23:
        raise HTTPException(status_code=400, detail="start_hour must be 0-23")
    if request.end_hour < 1 or request.end_hour > 24:
        raise HTTPException(status_code=400, detail="end_hour must be 1-24")
    if request.end_hour <= request.start_hour:
        raise HTTPException(status_code=400, detail="end_hour must be after start_hour")

    start_t = time(request.start_hour, 0)
    end_t = time(0, 0) if request.end_hour == 24 else time(request.end_hour, 0)

    created_count = 0
    already_existed = 0

    # DB convention in schema: 0=Sunday, 6=Saturday
    # Seed Monday-Friday => 1..5
    for day_of_week in range(1, 6):
        dup_res = await db.execute(
            select(Availability).where(
                and_(
                    Availability.location_id == request.location_id,
                    Availability.day_of_week == day_of_week,
                    Availability.start_time == start_t,
                    Availability.end_time == end_t,
                )
            )
        )
        if dup_res.scalar_one_or_none() is not None:
            already_existed += 1
            continue

        db.add(
            Availability(
                location_id=request.location_id,
                day_of_week=day_of_week,
                start_time=start_t,
                end_time=end_t,
                is_available=True,
                created_at=datetime.utcnow(),
            )
        )
        created_count += 1

    await db.commit()
    return SeedDefaultsResponse(created_count=created_count, already_existed=already_existed)


@router.get("/bookable-slots", response_model=AvailableSlotsResponse)
async def get_bookable_slots(
    location_id: str,
    date: str,
    db: AsyncSession = Depends(get_db),
):
    """Get bookable time slots for a location and date (YYYY-MM-DD)."""
    try:
        slot_date = datetime.strptime(date, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid date format. Use YYYY-MM-DD",
        )

    # Validate location
    result = await db.execute(select(Location).where(Location.id == location_id))
    location = result.scalar_one_or_none()
    if not location or not location.is_active:
        raise HTTPException(status_code=404, detail="Location not found")

    # Map Python weekday (Mon=0..Sun=6) to DB day_of_week (Sun=0..Sat=6)
    day_of_week = (slot_date.weekday() + 1) % 7

    result = await db.execute(
        select(Availability).where(
            and_(
                Availability.location_id == location_id,
                Availability.day_of_week == day_of_week,
                Availability.is_available == True,
            )
        )
    )
    availability_ranges = result.scalars().all()

    if not availability_ranges:
        return AvailableSlotsResponse(
            location_id=UUID(location_id),
            date=slot_date,
            slots_by_time=SlotsByTimeOfDay(morning=[], afternoon=[], evening=[]),
        )

    # Booked appointments for this date
    day_start = datetime.combine(slot_date, datetime.min.time())
    day_end = datetime.combine(slot_date, datetime.max.time())

    result = await db.execute(
        select(Appointment).where(
            and_(
                Appointment.location_id == location_id,
                Appointment.scheduled_start >= day_start,
                Appointment.scheduled_start <= day_end,
                Appointment.status.notin_([
                    AppointmentStatus.cancelled,
                    AppointmentStatus.no_show,
                ]),
            )
        )
    )
    booked = result.scalars().all()

    duration_mins = location.appointment_duration_mins or 30

    now = datetime.utcnow()
    is_today = slot_date == now.date()

    slots: list[TimeSlot] = []

    for avail in availability_ranges:
        current = avail.start_time
        while current < avail.end_time:
            slot_start = datetime.combine(slot_date, current)
            slot_end = slot_start + timedelta(minutes=duration_mins)

            # don't emit slots that run past the availability window
            if slot_end.time() > avail.end_time:
                break

            # Skip past slots for today's date
            if is_today and slot_start <= now:
                current = (datetime.combine(slot_date, current) + timedelta(minutes=15)).time()
                continue

            available = True
            for appt in booked:
                if not (slot_end <= appt.scheduled_start or slot_start >= appt.scheduled_end):
                    available = False
                    break

            slots.append(
                TimeSlot(
                    start=current.strftime("%H:%M"),
                    end=slot_end.time().strftime("%H:%M"),
                    available=available,
                )
            )

            current = (datetime.combine(slot_date, current) + timedelta(minutes=15)).time()

    return AvailableSlotsResponse(
        location_id=UUID(location_id),
        date=slot_date,
        slots_by_time=_categorize_slots(slots),
    )
