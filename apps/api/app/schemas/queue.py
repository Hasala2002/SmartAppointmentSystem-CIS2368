from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional

class CheckInRequest(BaseModel):
    appointment_id: UUID

class WalkInRequest(BaseModel):
    location_id: UUID

class QueueEntryResponse(BaseModel):
    id: UUID
    location_id: UUID
    customer_id: UUID
    appointment_id: Optional[UUID]
    queue_number: str  # Formatted as "A001"
    position: int
    estimated_wait_mins: Optional[int]
    status: str
    joined_at: Optional[datetime]
    called_at: Optional[datetime]

    class Config:
        from_attributes = True

class QueuePositionResponse(BaseModel):
    queue_number: str
    position: int
    estimated_wait_mins: int
    status: str
    total_ahead: int

class QueueEntryDict(BaseModel):
    id: str
    queue_number: str
    position: int
    status: str
    estimated_wait_mins: Optional[int]
    joined_at: Optional[str]

class QueueStatusResponse(BaseModel):
    location_id: str
    total_waiting: int
    currently_serving: Optional[str]
    entries: list[dict]
