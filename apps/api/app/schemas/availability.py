from pydantic import BaseModel
from uuid import UUID
from datetime import date


class TimeSlot(BaseModel):
    start: str  # "09:00"
    end: str    # "09:15"
    available: bool


class AvailableSlotsResponse(BaseModel):
    location_id: UUID
    date: date
    slots: list[TimeSlot]
