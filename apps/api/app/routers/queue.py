from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from datetime import datetime
from app.database import get_db
from app.core.dependencies import get_current_user, get_current_staff_user
from app.models.user import User
from app.models.queue_entry import QueueEntry, QueueStatus
from app.services.queue_service import QueueService
from app.schemas.queue import (
    CheckInRequest,
    WalkInRequest,
    QueueEntryResponse,
    QueuePositionResponse,
    QueueStatusResponse
)
from app.websocket.handlers import broadcast_queue_update, notify_customer_called
from app.models.queue_entry import QueueStatus
from app.services.notification_service import send_queue_called_notification, send_almost_ready_notification

router = APIRouter(prefix="/api/v1/queue", tags=["queue"])

def format_queue_number(num: int) -> str:
    return f"A{num:03d}"

@router.post("/check-in", response_model=QueueEntryResponse, status_code=status.HTTP_201_CREATED)
async def check_in_for_appointment(
    request: CheckInRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Check in for an appointment. Can be done by customer or staff."""
    service = QueueService(db)
    
    # Check if current user is staff
    from sqlalchemy import select
    from app.models.staff import Staff
    staff_result = await db.execute(
        select(Staff).where(Staff.user_id == current_user.id)
    )
    is_staff = staff_result.scalar_one_or_none() is not None
    
    try:
        # If staff, don't pass customer_id (will use appointment's customer)
        # If customer, pass their ID to verify ownership
        customer_id = None if is_staff else current_user.id
        entry = await service.check_in_appointment(request.appointment_id, customer_id)
        
        # Broadcast updated queue state
        await broadcast_queue_update(str(entry.location_id), db)
        
        return QueueEntryResponse(
            id=entry.id,
            location_id=entry.location_id,
            customer_id=entry.customer_id,
            appointment_id=entry.appointment_id,
            queue_number=format_queue_number(entry.queue_number),
            position=entry.position,
            estimated_wait_mins=entry.estimated_wait_mins,
            status=entry.status.value,
            joined_at=entry.joined_at,
            called_at=entry.called_at
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/walk-in", response_model=QueueEntryResponse, status_code=status.HTTP_201_CREATED)
async def join_as_walkin(
    request: WalkInRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Walk-in customer joins the queue without an appointment."""
    service = QueueService(db)
    try:
        entry = await service.join_as_walkin(request.location_id, current_user.id)
        
        # Broadcast updated queue state
        await broadcast_queue_update(str(entry.location_id), db)
        
        return QueueEntryResponse(
            id=entry.id,
            location_id=entry.location_id,
            customer_id=entry.customer_id,
            appointment_id=entry.appointment_id,
            queue_number=format_queue_number(entry.queue_number),
            position=entry.position,
            estimated_wait_mins=entry.estimated_wait_mins,
            status=entry.status.value,
            joined_at=entry.joined_at,
            called_at=entry.called_at
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/my-position", response_model=QueuePositionResponse)
async def get_my_position(
    location_id: UUID | None = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get customer's current position in queue."""
    service = QueueService(db)
    entry = await service.get_customer_position(current_user.id, location_id)
    
    if not entry:
        raise HTTPException(status_code=404, detail="Not currently in any queue")
    
    return QueuePositionResponse(
        queue_number=format_queue_number(entry.queue_number),
        position=entry.position,
        estimated_wait_mins=entry.estimated_wait_mins or 0,
        status=entry.status.value,
        total_ahead=max(0, entry.position - 1)
    )

@router.get("/status/{location_id}", response_model=QueueStatusResponse)
async def get_queue_status(
    location_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get full queue status for a location. Public endpoint."""
    service = QueueService(db)
    status = await service.get_queue_status(location_id)
    return QueueStatusResponse(**status)

@router.post("/call-next/{location_id}", response_model=QueueEntryResponse)
async def call_next_in_line(
    location_id: UUID,
    current_user: User = Depends(get_current_staff_user),
    db: AsyncSession = Depends(get_db)
):
    """Staff calls the next customer in line at a location."""
    service = QueueService(db)
    entry = await service.call_next(location_id)
    
    if not entry:
        raise HTTPException(status_code=404, detail="No customers waiting")
    
    # Get location name for notification
    from sqlalchemy import select
    from app.models.location import Location
    loc_result = await db.execute(select(Location).where(Location.id == location_id))
    location = loc_result.scalar_one_or_none()
    location_name = location.name if location else "Lone Star Dental"
    
    # Send push notification to called customer
    await send_queue_called_notification(
        db=db,
        user_id=entry.customer_id,
        queue_number=format_queue_number(entry.queue_number),
        location_name=location_name
    )
    
    # Broadcast WebSocket update
    await broadcast_queue_update(str(entry.location_id), db)
    await notify_customer_called(str(entry.location_id), format_queue_number(entry.queue_number), str(entry.customer_id))
    
    # Check if next person should get "almost ready" notification
    next_waiting = await db.execute(
        select(QueueEntry)
        .where(
            and_(
                QueueEntry.location_id == location_id,
                QueueEntry.status == QueueStatus.waiting
            )
        )
        .order_by(QueueEntry.position)
        .limit(2)
    )
    next_entries = next_waiting.scalars().all()
    
    for next_entry in next_entries:
        if next_entry.position <= 2:  # 1st or 2nd in line
            await send_almost_ready_notification(
                db=db,
                user_id=next_entry.customer_id,
                position=next_entry.position,
                queue_number=format_queue_number(next_entry.queue_number)
            )
    
    return QueueEntryResponse(
        id=entry.id,
        location_id=entry.location_id,
        customer_id=entry.customer_id,
        appointment_id=entry.appointment_id,
        queue_number=format_queue_number(entry.queue_number),
        position=entry.position,
        estimated_wait_mins=entry.estimated_wait_mins,
        status=entry.status.value,
        joined_at=entry.joined_at,
        called_at=entry.called_at
    )

@router.post("/{entry_id}/start-serving", response_model=QueueEntryResponse)
async def start_serving_customer(
    entry_id: UUID,
    current_user: User = Depends(get_current_staff_user),
    db: AsyncSession = Depends(get_db)
):
    """Staff starts serving a called customer."""
    service = QueueService(db)
    try:
        entry = await service.start_serving(entry_id)
        
        # Broadcast updated queue state
        await broadcast_queue_update(str(entry.location_id), db)
        
        return QueueEntryResponse(
            id=entry.id,
            location_id=entry.location_id,
            customer_id=entry.customer_id,
            appointment_id=entry.appointment_id,
            queue_number=format_queue_number(entry.queue_number),
            position=entry.position,
            estimated_wait_mins=entry.estimated_wait_mins,
            status=entry.status.value,
            joined_at=entry.joined_at,
            called_at=entry.called_at
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{entry_id}/complete", response_model=QueueEntryResponse)
async def complete_serving_customer(
    entry_id: UUID,
    current_user: User = Depends(get_current_staff_user),
    db: AsyncSession = Depends(get_db)
):
    """Staff completes serving a customer."""
    service = QueueService(db)
    try:
        entry = await service.complete_serving(entry_id)
        
        # Broadcast updated queue state
        await broadcast_queue_update(str(entry.location_id), db)
        
        return QueueEntryResponse(
            id=entry.id,
            location_id=entry.location_id,
            customer_id=entry.customer_id,
            appointment_id=entry.appointment_id,
            queue_number=format_queue_number(entry.queue_number),
            position=entry.position,
            estimated_wait_mins=entry.estimated_wait_mins,
            status=entry.status.value,
            joined_at=entry.joined_at,
            called_at=entry.called_at
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{entry_id}/no-show", response_model=QueueEntryResponse)
async def mark_customer_no_show(
    entry_id: UUID,
    current_user: User = Depends(get_current_staff_user),
    db: AsyncSession = Depends(get_db)
):
    """Staff marks a customer as no-show."""
    service = QueueService(db)
    try:
        entry = await service.mark_no_show(entry_id)
        
        # Broadcast updated queue state
        await broadcast_queue_update(str(entry.location_id), db)
        
        return QueueEntryResponse(
            id=entry.id,
            location_id=entry.location_id,
            customer_id=entry.customer_id,
            appointment_id=entry.appointment_id,
            queue_number=format_queue_number(entry.queue_number),
            position=entry.position,
            estimated_wait_mins=entry.estimated_wait_mins,
            status=entry.status.value,
            joined_at=entry.joined_at,
            called_at=entry.called_at
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{entry_id}")
async def leave_queue(
    entry_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Customer leaves the queue voluntarily."""
    service = QueueService(db)
    try:
        entry = await service.leave_queue(entry_id, current_user.id)
        
        # Broadcast updated queue state
        await broadcast_queue_update(str(entry.location_id), db)
        
        return {"message": "Successfully left the queue"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
