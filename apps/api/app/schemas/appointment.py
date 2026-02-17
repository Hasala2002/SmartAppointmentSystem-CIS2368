from pydantic import BaseModel
from uuid import UUID
from datetime import datetime


class CreateAppointmentRequest(BaseModel):
    location_id: UUID
    scheduled_start: datetime
    notes: str | None = None


class RescheduleRequest(BaseModel):
    scheduled_start: datetime


class CancelRequest(BaseModel):
    reason: str | None = None


class AppointmentResponse(BaseModel):
    id: UUID
    location_id: UUID
    customer_id: UUID
    staff_id: UUID | None
    scheduled_start: datetime
    scheduled_end: datetime
    status: str
    notes: str | None
    confirmation_token: str | None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
