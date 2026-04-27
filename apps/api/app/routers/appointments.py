from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from datetime import datetime, timedelta
import uuid
from app.database import get_db
from app.core.dependencies import get_current_user, get_current_staff_user
from app.models.user import User
from app.models.appointment import Appointment, AppointmentStatus
from app.models.location import Location
from app.models.staff import Staff
from app.schemas.appointment import (
    CreateAppointmentRequest,
    AppointmentResponse,
    RescheduleRequest,
    CancelRequest
)
from app.services.notification_service import send_appointment_confirmed_notification

router = APIRouter(prefix="/api/v1/appointments", tags=["appointments"])


async def _get_location_name(location_id, db: AsyncSession) -> str | None:
    """Helper to fetch location name"""
    result = await db.execute(select(Location).where(Location.id == location_id))
    location = result.scalar_one_or_none()
    return location.name if location else None


async def _build_appointment_response(
    appointment: Appointment,
    location_name: str | None = None,
    customer: User | None = None
) -> AppointmentResponse:
    """Helper to build appointment response with location and customer details"""
    return AppointmentResponse(
        id=appointment.id,
        location_id=appointment.location_id,
        location_name=location_name,
        customer_id=appointment.customer_id,
        customer_email=customer.email if customer else None,
        customer_first_name=customer.first_name if customer else None,
        customer_last_name=customer.last_name if customer else None,
        customer_phone=customer.phone if customer else None,
        customer_date_of_birth=customer.date_of_birth if customer else None,
        scheduled_start=appointment.scheduled_start,
        scheduled_end=appointment.scheduled_end,
        status=appointment.status.value if hasattr(appointment.status, 'value') else str(appointment.status),
        notes=appointment.notes,
        cancellation_reason=appointment.cancellation_reason,
        last_dental_visit=getattr(appointment, "last_dental_visit", None),
        has_dental_pain=getattr(appointment, "has_dental_pain", None),
        allergies=getattr(appointment, "allergies", None),
        additional_notes=getattr(appointment, "additional_notes", None),
        confirmation_token=appointment.confirmation_token,
        created_at=appointment.created_at,
        updated_at=appointment.updated_at
    )


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
    
    # Convert to naive datetime if timezone-aware
    scheduled_start = request.scheduled_start
    if scheduled_start.tzinfo is not None:
        scheduled_start = scheduled_start.replace(tzinfo=None)
    
    scheduled_end_input = request.scheduled_end
    if scheduled_end_input and scheduled_end_input.tzinfo is not None:
        scheduled_end_input = scheduled_end_input.replace(tzinfo=None)
    
    # Check for conflicts
    result = await db.execute(
        select(Appointment).where(
            (Appointment.location_id == request.location_id) &
            (Appointment.scheduled_start == scheduled_start) &
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
    scheduled_end = scheduled_end_input or (
        scheduled_start + timedelta(minutes=location.appointment_duration_mins or 30)
    )

    now = datetime.utcnow()
    appointment = Appointment(
        id=uuid.uuid4(),
        location_id=request.location_id,
        customer_id=current_user.id,
        scheduled_start=scheduled_start,
        scheduled_end=scheduled_end,
        status=AppointmentStatus.confirmed,  # Auto-confirm new appointments
        notes=request.notes,
        last_dental_visit=request.last_dental_visit,
        has_dental_pain=request.has_dental_pain,
        allergies=request.allergies,
        additional_notes=request.additional_notes,
        created_at=now,
        updated_at=now
    )
    
    db.add(appointment)
    await db.commit()
    await db.refresh(appointment)
    
    location_name = location.name
    
    # Send confirmation notification and email
    try:
        await send_appointment_confirmed_notification(
            db=db,
            user_id=current_user.id,
            date_str=scheduled_start.strftime("%B %d, %Y"),
            time_str=scheduled_start.strftime("%I:%M %p"),
            location_name=location_name,
            appointment_type=request.notes or "Dental Appointment"
        )
    except Exception as e:
        # Don't fail appointment creation if notification fails
        print(f"Failed to send appointment confirmation: {e}")
    
    return await _build_appointment_response(appointment, location_name, current_user)


@router.get("/", response_model=list[AppointmentResponse])
async def list_appointments(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """List appointments - customer sees their own, staff sees location appointments"""
    # Check if user is staff
    staff_result = await db.execute(
        select(Staff).where(Staff.user_id == current_user.id)
    )
    staff = staff_result.scalar_one_or_none()
    
    if staff:
        # Staff user - return appointments for their location(s)
        if staff.has_global_access:
            # Global staff sees all appointments
            result = await db.execute(select(Appointment).order_by(Appointment.scheduled_start.desc()))
        else:
            # Location-scoped staff sees only their location's appointments
            result = await db.execute(
                select(Appointment).where(
                    Appointment.location_id == staff.location_id
                ).order_by(Appointment.scheduled_start.desc())
            )
    else:
        # Customer user - return only their appointments
        result = await db.execute(
            select(Appointment).where(
                Appointment.customer_id == current_user.id
            )
        )
    
    appointments = result.scalars().all()
    
    # Fetch all location names and customers in one query each
    location_ids = {appt.location_id for appt in appointments}
    location_result = await db.execute(
        select(Location).where(Location.id.in_(location_ids))
    )
    locations_map = {loc.id: loc.name for loc in location_result.scalars().all()}
    
    customer_ids = {appt.customer_id for appt in appointments}
    customer_result = await db.execute(
        select(User).where(User.id.in_(customer_ids))
    )
    customers_map = {cust.id: cust for cust in customer_result.scalars().all()}
    
    return [
        await _build_appointment_response(
            appt,
            locations_map.get(appt.location_id),
            customers_map.get(appt.customer_id)
        )
        for appt in appointments
    ]


@router.get("/{appointment_id}", response_model=AppointmentResponse)
async def get_appointment(
    appointment_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get appointment details"""
    result = await db.execute(select(Appointment).where(Appointment.id == appointment_id))
    appointment = result.scalar_one_or_none()
    
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found"
        )
    
    # Check authorization: customer can view their own, staff can view their location's
    staff_result = await db.execute(
        select(Staff).where(Staff.user_id == current_user.id)
    )
    staff = staff_result.scalar_one_or_none()
    
    if not staff and appointment.customer_id != current_user.id:
        # Not staff and not the customer
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found"
        )
    
    if staff and not staff.has_global_access and appointment.location_id != staff.location_id:
        # Location-scoped staff trying to view appointment from different location
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found"
        )
    
    location_name = await _get_location_name(appointment.location_id, db)
    customer_result = await db.execute(select(User).where(User.id == appointment.customer_id))
    customer = customer_result.scalar_one_or_none()
    return await _build_appointment_response(appointment, location_name, customer)


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
    scheduled_end = request.scheduled_end or (
        request.scheduled_start + timedelta(minutes=30)
    )
    appointment.scheduled_start = request.scheduled_start
    appointment.scheduled_end = scheduled_end
    
    await db.commit()
    await db.refresh(appointment)
    
    location_name = await _get_location_name(appointment.location_id, db)
    
    # Send rescheduled confirmation notification and email
    try:
        await send_appointment_confirmed_notification(
            db=db,
            user_id=current_user.id,
            date_str=request.scheduled_start.strftime("%B %d, %Y"),
            time_str=request.scheduled_start.strftime("%I:%M %p"),
            location_name=location_name,
            appointment_type="Rescheduled Appointment"
        )
    except Exception as e:
        # Don't fail reschedule if notification fails
        print(f"Failed to send reschedule confirmation: {e}")
    
    return await _build_appointment_response(appointment, location_name, current_user)


@router.patch("/{appointment_id}/cancel", response_model=AppointmentResponse)
async def cancel_appointment(
    appointment_id: str,
    request: CancelRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Cancel an appointment - can be done by customer or staff"""
    result = await db.execute(select(Appointment).where(Appointment.id == appointment_id))
    appointment = result.scalar_one_or_none()
    
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found"
        )
    
    # Check authorization: customer can cancel their own, staff can cancel their location's
    staff_result = await db.execute(
        select(Staff).where(Staff.user_id == current_user.id)
    )
    staff = staff_result.scalar_one_or_none()
    
    if not staff and appointment.customer_id != current_user.id:
        # Not staff and not the customer
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found"
        )
    
    if staff and not staff.has_global_access and appointment.location_id != staff.location_id:
        # Location-scoped staff trying to cancel appointment from different location
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to cancel this appointment"
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
    appointment.updated_at = datetime.utcnow()
    
    # Remove from queue if checked in
    from app.models.queue_entry import QueueEntry, QueueStatus
    from app.websocket.handlers import broadcast_queue_update
    from app.services.notification_service import send_appointment_cancelled_notification
    
    queue_result = await db.execute(
        select(QueueEntry).where(
            and_(
                QueueEntry.appointment_id == appointment_id,
                QueueEntry.status.in_([QueueStatus.waiting, QueueStatus.called, QueueStatus.serving])
            )
        )
    )
    queue_entry = queue_result.scalar_one_or_none()
    if queue_entry:
        queue_entry.status = QueueStatus.left
        queue_entry.updated_at = datetime.utcnow()
        
        # Recalculate positions for remaining entries
        from app.services.queue_service import QueueService
        queue_service = QueueService(db)
        await queue_service._recalculate_positions(appointment.location_id)
    
    await db.commit()
    await db.refresh(appointment)
    
    # Broadcast queue update if entry was removed
    if queue_entry:
        await broadcast_queue_update(str(appointment.location_id), db)
    
    location_name = await _get_location_name(appointment.location_id, db)
    customer_result = await db.execute(select(User).where(User.id == appointment.customer_id))
    customer = customer_result.scalar_one_or_none()
    
    # Send cancellation notification and email
    try:
        await send_appointment_cancelled_notification(
            db=db,
            user_id=appointment.customer_id,
            date_str=appointment.scheduled_start.strftime("%B %d, %Y"),
            time_str=appointment.scheduled_start.strftime("%I:%M %p"),
            location_name=location_name
        )
    except Exception as e:
        # Don't fail cancellation if notification fails
        print(f"Failed to send cancellation notification: {e}")
    
    return await _build_appointment_response(appointment, location_name, customer)
