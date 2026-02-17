from pydantic import BaseModel
from uuid import UUID
from datetime import datetime


class LocationResponse(BaseModel):
    id: UUID
    name: str
    slug: str
    address: str | None
    city: str | None
    state: str | None
    zip_code: str | None
    phone: str | None
    timezone: str
    appointment_duration_mins: int
    buffer_mins: int
    is_active: bool

    class Config:
        from_attributes = True
