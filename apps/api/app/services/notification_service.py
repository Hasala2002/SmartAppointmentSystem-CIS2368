from pywebpush import webpush, WebPushException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from uuid import UUID
from datetime import datetime
import json
from typing import Optional, List
from app.config import settings
from app.models.push_subscription import PushSubscription
from app.models.user import User

class NotificationService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def subscribe(
        self,
        user_id: UUID,
        endpoint: str,
        p256dh_key: str,
        auth_key: str,
        user_agent: Optional[str] = None
    ) -> PushSubscription:
        """
        Register a push subscription for a user.
        Updates existing subscription if endpoint already exists.
        """
        # Check if subscription already exists
        result = await self.db.execute(
            select(PushSubscription).where(
                and_(
                    PushSubscription.user_id == user_id,
                    PushSubscription.endpoint == endpoint
                )
            )
        )
        existing = result.scalar_one_or_none()

        if existing:
            # Update existing subscription
            existing.p256dh_key = p256dh_key
            existing.auth_key = auth_key
            existing.user_agent = user_agent
            existing.is_active = True
            existing.updated_at = datetime.utcnow()
            await self.db.commit()
            await self.db.refresh(existing)
            return existing

        # Create new subscription
        subscription = PushSubscription(
            user_id=user_id,
            endpoint=endpoint,
            p256dh_key=p256dh_key,
            auth_key=auth_key,
            user_agent=user_agent,
            is_active=True,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        self.db.add(subscription)
        await self.db.commit()
        await self.db.refresh(subscription)
        return subscription

    async def unsubscribe(self, user_id: UUID, endpoint: str) -> bool:
        """
        Deactivate a push subscription.
        """
        result = await self.db.execute(
            select(PushSubscription).where(
                and_(
                    PushSubscription.user_id == user_id,
                    PushSubscription.endpoint == endpoint
                )
            )
        )
        subscription = result.scalar_one_or_none()

        if not subscription:
            return False

        subscription.is_active = False
        subscription.updated_at = datetime.utcnow()
        await self.db.commit()
        return True

    async def get_user_subscriptions(self, user_id: UUID) -> List[PushSubscription]:
        """
        Get all active subscriptions for a user.
        """
        result = await self.db.execute(
            select(PushSubscription).where(
                and_(
                    PushSubscription.user_id == user_id,
                    PushSubscription.is_active == True
                )
            )
        )
        return result.scalars().all()

    async def send_push_to_user(
        self,
        user_id: UUID,
        title: str,
        body: str,
        url: Optional[str] = None,
        data: Optional[dict] = None
    ) -> dict:
        """
        Send push notification to all active subscriptions for a user.
        Returns dict with success/failure counts.
        """
        subscriptions = await self.get_user_subscriptions(user_id)
        
        if not subscriptions:
            return {"sent": 0, "failed": 0, "message": "No active subscriptions"}

        payload = json.dumps({
            "title": title,
            "body": body,
            "url": url or "/",
            "data": data or {},
            "timestamp": datetime.utcnow().isoformat()
        })

        sent = 0
        failed = 0
        expired = []

        for subscription in subscriptions:
            success = await self._send_push(subscription, payload)
            if success:
                sent += 1
            elif success is None:
                # Subscription expired
                expired.append(subscription)
                failed += 1
            else:
                failed += 1

        # Deactivate expired subscriptions
        for sub in expired:
            sub.is_active = False
            sub.updated_at = datetime.utcnow()
        
        if expired:
            await self.db.commit()

        return {"sent": sent, "failed": failed, "expired": len(expired)}

    async def _send_push(self, subscription: PushSubscription, payload: str) -> Optional[bool]:
        """
        Send push to a single subscription.
        Returns True on success, False on error, None if subscription expired.
        """
        try:
            webpush(
                subscription_info={
                    "endpoint": subscription.endpoint,
                    "keys": {
                        "p256dh": subscription.p256dh_key,
                        "auth": subscription.auth_key
                    }
                },
                data=payload,
                vapid_private_key=settings.VAPID_PRIVATE_KEY,
                vapid_claims={"sub": settings.VAPID_EMAIL}
            )
            return True
        except WebPushException as e:
            print(f"[Push] Error sending to {subscription.endpoint[:50]}...: {e}")
            
            # 410 Gone = subscription expired
            if e.response and e.response.status_code == 410:
                return None
            
            # 404 Not Found = subscription invalid
            if e.response and e.response.status_code == 404:
                return None
            
            return False
        except Exception as e:
            print(f"[Push] Unexpected error: {e}")
            return False


# Standalone functions for use outside of request context

async def send_queue_called_notification(db: AsyncSession, user_id: UUID, queue_number: str, location_name: str):
    """Send notification when customer is called."""
    service = NotificationService(db)
    await service.send_push_to_user(
        user_id=user_id,
        title="You're Up! 🦷",
        body=f"{queue_number}, please proceed to the counter at {location_name}",
        url="/queue",
        data={"type": "queue_called", "queue_number": queue_number}
    )

async def send_almost_ready_notification(db: AsyncSession, user_id: UUID, position: int, queue_number: str):
    """Send notification when customer is almost up (1-2 people ahead)."""
    service = NotificationService(db)
    people_text = "1 person" if position == 2 else f"{position - 1} people"
    await service.send_push_to_user(
        user_id=user_id,
        title="Almost Your Turn! 🦷",
        body=f"{queue_number}, only {people_text} ahead of you. Please be ready.",
        url="/queue",
        data={"type": "almost_ready", "queue_number": queue_number, "position": position}
    )

async def send_appointment_confirmed_notification(db: AsyncSession, user_id: UUID, date_str: str, time_str: str, location_name: str):
    """Send notification when appointment is confirmed."""
    service = NotificationService(db)
    await service.send_push_to_user(
        user_id=user_id,
        title="Appointment Confirmed ✓",
        body=f"Your appointment at {location_name} on {date_str} at {time_str} is confirmed.",
        url="/dashboard",
        data={"type": "appointment_confirmed"}
    )

async def send_appointment_reminder_notification(db: AsyncSession, user_id: UUID, time_str: str, location_name: str):
    """Send reminder notification before appointment."""
    service = NotificationService(db)
    await service.send_push_to_user(
        user_id=user_id,
        title="Appointment Reminder 🦷",
        body=f"Your appointment at {location_name} is in 1 hour ({time_str}). See you soon!",
        url="/dashboard",
        data={"type": "appointment_reminder"}
    )

async def send_appointment_cancelled_notification(db: AsyncSession, user_id: UUID, date_str: str, location_name: str):
    """Send notification when appointment is cancelled."""
    service = NotificationService(db)
    await service.send_push_to_user(
        user_id=user_id,
        title="Appointment Cancelled",
        body=f"Your appointment at {location_name} on {date_str} has been cancelled.",
        url="/dashboard",
        data={"type": "appointment_cancelled"}
    )
