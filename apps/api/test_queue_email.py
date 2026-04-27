"""
Test script for queue email notification
"""
import asyncio
import sys
import os

# Add the app directory to the path
sys.path.insert(0, os.path.dirname(__file__))

from app.database import AsyncSessionLocal
from app.services.notification_service import send_queue_called_notification
from app.models.user import User
from sqlalchemy import select


async def test_queue_email():
    """Test queue called email notification"""
    
    print("=" * 60)
    print("Testing Queue Called Email Notification")
    print("=" * 60)
    
    async with AsyncSessionLocal() as db:
        # Get a test user from the database
        result = await db.execute(select(User).limit(1))
        user = result.scalar_one_or_none()
        
        if not user:
            print("❌ No users found in database. Please create a user first.")
            return
        
        print(f"\nTest User: {user.email}")
        print(f"User ID: {user.id}")
        print(f"Name: {user.first_name} {user.last_name}")
        print("=" * 60)
        
        # Test: Queue Called Notification
        print("\n🔔 Testing Queue Called Notification...")
        try:
            await send_queue_called_notification(
                db=db,
                user_id=user.id,
                queue_number="A-042",
                location_name="Downtown Dental Clinic"
            )
            print("✓ Queue called notification and email sent!")
        except Exception as e:
            print(f"✗ Failed: {e}")
            import traceback
            traceback.print_exc()
        
        print("\n" + "=" * 60)
        print("✓ Test completed!")
        print(f"📧 Check your inbox at: {user.email}")
        print("=" * 60)


if __name__ == "__main__":
    asyncio.run(test_queue_email())
