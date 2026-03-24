from sqlalchemy import Column, Integer, Boolean, DateTime, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base
import uuid
import enum

class QueueStatus(str, enum.Enum):
    waiting = "waiting"
    called = "called"
    serving = "serving"
    completed = "completed"
    left = "left"

class QueueEntry(Base):
    __tablename__ = "queue_entries"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    location_id = Column(UUID(as_uuid=True), ForeignKey("locations.id", ondelete="CASCADE"), nullable=False)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    appointment_id = Column(UUID(as_uuid=True), ForeignKey("appointments.id", ondelete="CASCADE"), nullable=True)
    queue_number = Column(Integer, nullable=False)
    position = Column(Integer, nullable=False)
    estimated_wait_mins = Column(Integer, nullable=True)
    priority = Column(Integer, nullable=False, default=0)
    status = Column(Enum(QueueStatus, name="queue_status"), nullable=False, default=QueueStatus.waiting)
    joined_at = Column(DateTime, nullable=False)
    called_at = Column(DateTime, nullable=True)
    serving_started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, nullable=False)
    updated_at = Column(DateTime, nullable=False)
