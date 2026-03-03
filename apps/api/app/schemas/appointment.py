from pydantic import BaseModel
from uuid import UUID
from datetime import datetime, date
from typing import Literal


class CreateAppointmentRequest(BaseModel):
    location_id: UUID
    scheduled_start: datetime
    scheduled_end: datetime | None = None
    notes: str | None = None
    last_dental_visit: Literal['within-6-months','6-12-months','over-a-year','never'] | None = None
    has_dental_pain: bool | None = None
    allergies: str | None = None
    additional_notes: str | None = None


class RescheduleRequest(BaseModel):
    scheduled_start: datetime
    scheduled_end: datetime | None = None


class CancelRequest(BaseModel):
    reason: str | None = None


class AppointmentResponse(BaseModel):
    id: UUID
    location_id: UUID
    location_name: str | None = None
    customer_id: UUID
    customer_email: str | None = None
    customer_first_name: str | None = None
    customer_last_name: str | None = None
    customer_phone: str | None = None
    customer_date_of_birth: date | None = None
    scheduled_start: datetime
    scheduled_end: datetime
    status: str
    notes: str | None
    last_dental_visit: str | None
    has_dental_pain: bool | None
    allergies: str | None
    additional_notes: str | None
    confirmation_token: str | None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
