from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, update
from datetime import datetime, date
from uuid import UUID
from typing import Optional
from app.models.queue_entry import QueueEntry, QueueStatus
from app.models.appointment import Appointment, AppointmentStatus
from app.models.location import Location

class QueueService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def generate_queue_number(self, location_id: UUID) -> str:
        """
        Generate queue number like A001, A002, etc.
        Resets daily per location.
        """
        today_start = datetime.combine(date.today(), datetime.min.time())
        
        # Get highest queue number for today at this location
        result = await self.db.execute(
            select(func.max(QueueEntry.queue_number))
            .where(
                and_(
                    QueueEntry.location_id == location_id,
                    QueueEntry.created_at >= today_start
                )
            )
        )
        max_num = result.scalar() or 0
        next_num = max_num + 1
        
        return f"A{next_num:03d}"  # A001, A002, etc.

    async def get_next_position(self, location_id: UUID) -> int:
        """Get the next position in queue for a location."""
        result = await self.db.execute(
            select(func.count(QueueEntry.id))
            .where(
                and_(
                    QueueEntry.location_id == location_id,
                    QueueEntry.status == QueueStatus.waiting
                )
            )
        )
        count = result.scalar() or 0
        return count + 1

    async def calculate_wait_time(self, position: int, location_id: UUID) -> int:
        """
        Calculate estimated wait time in minutes.
        Simple formula: position * average_service_time
        """
        # Get location's appointment duration as average service time
        result = await self.db.execute(
            select(Location).where(Location.id == location_id)
        )
        location = result.scalar_one_or_none()
        
        avg_service_time = location.appointment_duration_mins if location else 15
        
        # Position 1 = currently next, so (position - 1) people ahead
        people_ahead = max(0, position - 1)
        return people_ahead * avg_service_time

    async def check_in_appointment(
        self, 
        appointment_id: UUID, 
        customer_id: UUID | None = None
    ) -> QueueEntry:
        """
        Check in for an appointment.
        If customer_id is provided, verifies it matches the appointment.
        If customer_id is None (staff check-in), uses the appointment's customer_id.
        Creates a queue entry linked to the appointment.
        """
        # Get the appointment and verify it's eligible for check-in
        result = await self.db.execute(
            select(Appointment).where(
                and_(
                    Appointment.id == appointment_id,
                    Appointment.status == AppointmentStatus.confirmed
                )
            )
        )
        appointment = result.scalar_one_or_none()
        
        if not appointment:
            raise ValueError("Appointment not found or not eligible for check-in")
        
        # If customer_id provided, verify it matches
        if customer_id and appointment.customer_id != customer_id:
            raise ValueError("Appointment does not belong to this customer")
        
        # Use appointment's customer_id if not provided (staff check-in)
        actual_customer_id = customer_id if customer_id else appointment.customer_id
        
        # Check if already checked in
        existing = await self.db.execute(
            select(QueueEntry).where(
                and_(
                    QueueEntry.appointment_id == appointment_id,
                    QueueEntry.status.in_([QueueStatus.waiting, QueueStatus.called, QueueStatus.serving])
                )
            )
        )
        if existing.scalar_one_or_none():
            raise ValueError("Already checked in for this appointment")
        
        # Update appointment status
        appointment.status = AppointmentStatus.checked_in
        appointment.check_in_time = datetime.utcnow()
        
        # Create queue entry
        queue_number = await self.generate_queue_number(appointment.location_id)
        position = await self.get_next_position(appointment.location_id)
        wait_time = await self.calculate_wait_time(position, appointment.location_id)
        
        queue_entry = QueueEntry(
            location_id=appointment.location_id,
            customer_id=actual_customer_id,
            appointment_id=appointment_id,
            queue_number=int(queue_number[1:]),  # Store as int (strip 'A')
            position=position,
            estimated_wait_mins=wait_time,
            status=QueueStatus.waiting,
            joined_at=datetime.utcnow(),
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        self.db.add(queue_entry)
        await self.db.commit()
        await self.db.refresh(queue_entry)
        
        return queue_entry

    async def join_as_walkin(
        self,
        location_id: UUID,
        customer_id: UUID
    ) -> QueueEntry:
        """
        Walk-in customer joins the queue without an appointment.
        """
        # Verify location exists
        result = await self.db.execute(
            select(Location).where(Location.id == location_id)
        )
        if not result.scalar_one_or_none():
            raise ValueError("Location not found")
        
        # Check if already in queue
        existing = await self.db.execute(
            select(QueueEntry).where(
                and_(
                    QueueEntry.customer_id == customer_id,
                    QueueEntry.location_id == location_id,
                    QueueEntry.status.in_([QueueStatus.waiting, QueueStatus.called, QueueStatus.serving])
                )
            )
        )
        if existing.scalar_one_or_none():
            raise ValueError("Already in queue at this location")
        
        # Create queue entry
        queue_number = await self.generate_queue_number(location_id)
        position = await self.get_next_position(location_id)
        wait_time = await self.calculate_wait_time(position, location_id)
        
        queue_entry = QueueEntry(
            location_id=location_id,
            customer_id=customer_id,
            appointment_id=None,  # No appointment for walk-ins
            queue_number=int(queue_number[1:]),
            position=position,
            estimated_wait_mins=wait_time,
            status=QueueStatus.waiting,
            joined_at=datetime.utcnow(),
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        self.db.add(queue_entry)
        await self.db.commit()
        await self.db.refresh(queue_entry)
        
        return queue_entry

    async def get_customer_position(
        self,
        customer_id: UUID,
        location_id: Optional[UUID] = None
    ) -> Optional[QueueEntry]:
        """Get customer's current queue entry."""
        query = select(QueueEntry).where(
            and_(
                QueueEntry.customer_id == customer_id,
                QueueEntry.status.in_([QueueStatus.waiting, QueueStatus.called, QueueStatus.serving])
            )
        )
        
        if location_id:
            query = query.where(QueueEntry.location_id == location_id)
        
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def get_queue_status(self, location_id: UUID) -> dict:
        """Get full queue status for a location."""
        # Get all waiting/called/serving entries
        result = await self.db.execute(
            select(QueueEntry)
            .where(
                and_(
                    QueueEntry.location_id == location_id,
                    QueueEntry.status.in_([QueueStatus.waiting, QueueStatus.called, QueueStatus.serving])
                )
            )
            .order_by(QueueEntry.position)
        )
        entries = result.scalars().all()
        
        # Get currently serving
        currently_serving = next(
            (e for e in entries if e.status == QueueStatus.serving),
            None
        )
        
        # Get waiting count
        waiting = [e for e in entries if e.status == QueueStatus.waiting]
        
        return {
            "location_id": str(location_id),
            "total_waiting": len(waiting),
            "currently_serving": f"A{currently_serving.queue_number:03d}" if currently_serving else None,
            "entries": [
                {
                    "id": str(e.id),
                    "queue_number": f"A{e.queue_number:03d}",
                    "position": e.position,
                    "status": e.status.value,
                    "estimated_wait_mins": e.estimated_wait_mins,
                    "joined_at": e.joined_at.isoformat() if e.joined_at else None
                }
                for e in entries
            ]
        }

    async def call_next(self, location_id: UUID) -> Optional[QueueEntry]:
        """
        Staff calls the next customer in queue.
        Returns the called queue entry.
        """
        # Get next waiting entry (lowest position)
        result = await self.db.execute(
            select(QueueEntry)
            .where(
                and_(
                    QueueEntry.location_id == location_id,
                    QueueEntry.status == QueueStatus.waiting
                )
            )
            .order_by(QueueEntry.position)
            .limit(1)
        )
        next_entry = result.scalar_one_or_none()
        
        if not next_entry:
            return None
        
        next_entry.status = QueueStatus.called
        next_entry.called_at = datetime.utcnow()
        next_entry.updated_at = datetime.utcnow()
        
        await self.db.commit()
        await self.db.refresh(next_entry)
        
        return next_entry

    async def start_serving(self, queue_entry_id: UUID) -> QueueEntry:
        """Mark queue entry as being served."""
        result = await self.db.execute(
            select(QueueEntry).where(QueueEntry.id == queue_entry_id)
        )
        entry = result.scalar_one_or_none()
        
        if not entry:
            raise ValueError("Queue entry not found")
        
        if entry.status != QueueStatus.called:
            raise ValueError("Can only start serving a called entry")
        
        entry.status = QueueStatus.serving
        entry.serving_started_at = datetime.utcnow()
        entry.updated_at = datetime.utcnow()
        
        await self.db.commit()
        await self.db.refresh(entry)
        
        return entry

    async def complete_serving(self, queue_entry_id: UUID) -> QueueEntry:
        """Mark queue entry as completed and update positions."""
        result = await self.db.execute(
            select(QueueEntry).where(QueueEntry.id == queue_entry_id)
        )
        entry = result.scalar_one_or_none()
        
        if not entry:
            raise ValueError("Queue entry not found")
        
        entry.status = QueueStatus.completed
        entry.completed_at = datetime.utcnow()
        entry.updated_at = datetime.utcnow()
        
        # Update linked appointment if exists
        if entry.appointment_id:
            appt_result = await self.db.execute(
                select(Appointment).where(Appointment.id == entry.appointment_id)
            )
            appointment = appt_result.scalar_one_or_none()
            if appointment:
                appointment.status = AppointmentStatus.completed
                appointment.actual_end_time = datetime.utcnow()
        
        # Recalculate positions for remaining waiting entries
        await self._recalculate_positions(entry.location_id)
        
        await self.db.commit()
        await self.db.refresh(entry)
        
        return entry

    async def mark_no_show(self, queue_entry_id: UUID) -> QueueEntry:
        """Mark queue entry as no-show."""
        result = await self.db.execute(
            select(QueueEntry).where(QueueEntry.id == queue_entry_id)
        )
        entry = result.scalar_one_or_none()
        
        if not entry:
            raise ValueError("Queue entry not found")
        
        entry.status = QueueStatus.left
        entry.updated_at = datetime.utcnow()
        
        # Update linked appointment if exists
        if entry.appointment_id:
            appt_result = await self.db.execute(
                select(Appointment).where(Appointment.id == entry.appointment_id)
            )
            appointment = appt_result.scalar_one_or_none()
            if appointment:
                appointment.status = AppointmentStatus.no_show
        
        # Recalculate positions
        await self._recalculate_positions(entry.location_id)
        
        await self.db.commit()
        await self.db.refresh(entry)
        
        return entry

    async def leave_queue(self, queue_entry_id: UUID, customer_id: UUID) -> QueueEntry:
        """Customer voluntarily leaves the queue."""
        result = await self.db.execute(
            select(QueueEntry).where(
                and_(
                    QueueEntry.id == queue_entry_id,
                    QueueEntry.customer_id == customer_id,
                    QueueEntry.status.in_([QueueStatus.waiting, QueueStatus.called])
                )
            )
        )
        entry = result.scalar_one_or_none()
        
        if not entry:
            raise ValueError("Queue entry not found or cannot leave")
        
        entry.status = QueueStatus.left
        entry.updated_at = datetime.utcnow()
        
        # Recalculate positions
        await self._recalculate_positions(entry.location_id)
        
        await self.db.commit()
        await self.db.refresh(entry)
        
        return entry

    async def _recalculate_positions(self, location_id: UUID):
        """Recalculate positions and wait times for all waiting entries."""
        result = await self.db.execute(
            select(QueueEntry)
            .where(
                and_(
                    QueueEntry.location_id == location_id,
                    QueueEntry.status == QueueStatus.waiting
                )
            )
            .order_by(QueueEntry.joined_at)
        )
        entries = result.scalars().all()
        
        for i, entry in enumerate(entries, start=1):
            entry.position = i
            entry.estimated_wait_mins = await self.calculate_wait_time(i, location_id)
            entry.updated_at = datetime.utcnow()
