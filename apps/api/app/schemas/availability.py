from pydantic import BaseModel
from uuid import UUID
from datetime import date


class TimeSlot(BaseModel):
    start: str  # "09:00"
    end: str    # "09:30"
    available: bool


class AvailabilityRange(BaseModel):
    day_of_week: int  # 0=Sunday, 6=Saturday
    start_time: str   # "09:00"
    end_time: str     # "17:00"


class BulkCreateRequest(BaseModel):
    location_id: UUID
    ranges: list[AvailabilityRange]


class BulkCreateResponse(BaseModel):
    created_count: int
    duplicates_skipped: int


class SeedDefaultsRequest(BaseModel):
    location_id: UUID
    start_hour: int = 9
    end_hour: int = 17


class SeedDefaultsResponse(BaseModel):
    created_count: int
    already_existed: int


class SlotsByTimeOfDay(BaseModel):
    morning: list[TimeSlot]
    afternoon: list[TimeSlot]
    evening: list[TimeSlot]


class AvailableSlotsResponse(BaseModel):
    location_id: UUID
    date: date
    slots_by_time: SlotsByTimeOfDay
