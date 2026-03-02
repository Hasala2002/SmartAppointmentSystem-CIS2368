from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
class CreateLocationRequest(BaseModel):
    name: str
    slug: str
    address: str | None = None
    city: str | None = None
    state: str | None = None
    zip_code: str | None = None
    phone: str | None = None
    timezone: str = "America/Chicago"
    appointment_duration_mins: int = 30
    buffer_mins: int = 0
    is_active: bool = True


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
