from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.user import User
from app.services.notification_service import NotificationService
from app.schemas.notifications import (
    PushSubscriptionRequest,
    PushSubscriptionResponse,
    UnsubscribeRequest,
    TestNotificationRequest,
    VapidPublicKeyResponse
)
from app.core.dependencies import get_current_user
from app.config import settings

router = APIRouter(prefix="/api/v1/notifications", tags=["notifications"])

@router.get("/vapid-public-key", response_model=VapidPublicKeyResponse)
async def get_vapid_public_key():
    """
    Get the VAPID public key for push subscription.
    Frontend needs this to subscribe to push notifications.
    """
    if not settings.VAPID_PUBLIC_KEY:
        raise HTTPException(
            status_code=500,
            detail="Push notifications not configured"
        )
    return VapidPublicKeyResponse(public_key=settings.VAPID_PUBLIC_KEY)

@router.post("/subscribe", response_model=PushSubscriptionResponse, status_code=status.HTTP_201_CREATED)
async def subscribe_to_push(
    request: PushSubscriptionRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Register a push subscription for the current user.
    Called by frontend after user grants notification permission.
    """
    service = NotificationService(db)
    subscription = await service.subscribe(
        user_id=current_user.id,
        endpoint=request.endpoint,
        p256dh_key=request.keys.p256dh,
        auth_key=request.keys.auth,
        user_agent=request.user_agent
    )
    return subscription

@router.post("/unsubscribe")
async def unsubscribe_from_push(
    request: UnsubscribeRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Unsubscribe from push notifications.
    """
    service = NotificationService(db)
    success = await service.unsubscribe(current_user.id, request.endpoint)
    
    if not success:
        raise HTTPException(status_code=404, detail="Subscription not found")
    
    return {"message": "Successfully unsubscribed"}

@router.post("/test")
async def send_test_notification(
    request: TestNotificationRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Send a test notification to the current user.
    Useful for testing push notification setup.
    """
    service = NotificationService(db)
    result = await service.send_push_to_user(
        user_id=current_user.id,
        title=request.title,
        body=request.body,
        url=request.url
    )
    return result

@router.get("/subscriptions")
async def get_my_subscriptions(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get all active push subscriptions for the current user.
    """
    service = NotificationService(db)
    subscriptions = await service.get_user_subscriptions(current_user.id)
    return {
        "count": len(subscriptions),
        "subscriptions": [
            {
                "id": str(s.id),
                "endpoint": s.endpoint[:50] + "..." if len(s.endpoint) > 50 else s.endpoint,
                "user_agent": s.user_agent,
                "created_at": s.created_at.isoformat()
            }
            for s in subscriptions
        ]
    }
