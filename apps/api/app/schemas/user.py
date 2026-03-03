from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime, date
from typing import Literal

class CreateStaffRequest(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str
    phone: str | None = None
    location_id: UUID | None = None
    is_admin: bool = False
    has_global_access: bool = False
    date_of_birth: date | None = None
    has_dental_insurance: bool | None = None


class UserResponse(BaseModel):
    id: UUID
    email: EmailStr
    first_name: str
    last_name: str
    phone: str | None
    date_of_birth: date | None
    has_dental_insurance: bool | None
    role: str
    is_active: bool
    email_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True
