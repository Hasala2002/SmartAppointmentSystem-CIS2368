from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional

class PushSubscriptionKeys(BaseModel):
    p256dh: str
    auth: str

class PushSubscriptionRequest(BaseModel):
    endpoint: str
    keys: PushSubscriptionKeys
    user_agent: Optional[str] = None

class PushSubscriptionResponse(BaseModel):
    id: UUID
    user_id: UUID
    endpoint: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class UnsubscribeRequest(BaseModel):
    endpoint: str

class TestNotificationRequest(BaseModel):
    title: str = "Test Notification"
    body: str = "This is a test notification from Lone Star Dental"
    url: Optional[str] = "/"

class VapidPublicKeyResponse(BaseModel):
    public_key: str
