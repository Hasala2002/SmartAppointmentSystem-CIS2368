"""
Test script for appointment email integration
This tests the notification service functions directly
"""
import asyncio
import sys
import os
from datetime import datetime
from uuid import uuid4

# Add the app directory to the path
sys.path.insert(0, os.path.dirname(__file__))

from app.database import AsyncSessionLocal
from app.services.notification_service import (
    send_appointment_confirmed_notification,
    send_appointment_reminder_notification,
    send_appointment_cancelled_notification
)
from app.models.user import User
from sqlalchemy import select


async def test_appointment_notifications():
    """Test appointment notification/email functions"""
    
    print("=" * 60)
    print("Testing Appointment Email Integration")
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
        
        # Test 1: Appointment Confirmation
        print("\n1️⃣  Testing Appointment Confirmation...")
        try:
            await send_appointment_confirmed_notification(
                db=db,
                user_id=user.id,
                date_str="April 15, 2026",
                time_str="2:00 PM",
                location_name="Downtown Dental Clinic",
                appointment_type="Teeth Cleaning"
            )
            print("✓ Appointment confirmation sent!")
        except Exception as e:
            print(f"✗ Failed: {e}")
        
        # Test 2: Appointment Reminder
        print("\n2️⃣  Testing Appointment Reminder...")
        try:
            await send_appointment_reminder_notification(
                db=db,
                user_id=user.id,
                date_str="April 16, 2026",
                time_str="3:30 PM",
                location_name="Downtown Dental Clinic"
            )
            print("✓ Appointment reminder sent!")
        except Exception as e:
            print(f"✗ Failed: {e}")
        
        # Test 3: Appointment Cancellation
        print("\n3️⃣  Testing Appointment Cancellation...")
        try:
            await send_appointment_cancelled_notification(
                db=db,
                user_id=user.id,
                date_str="April 20, 2026",
                time_str="10:00 AM",
                location_name="Downtown Dental Clinic"
            )
            print("✓ Appointment cancellation sent!")
        except Exception as e:
            print(f"✗ Failed: {e}")
        
        print("\n" + "=" * 60)
        print("✓ All tests completed!")
        print(f"📧 Check your inbox at: {user.email}")
        print("=" * 60)


if __name__ == "__main__":
    asyncio.run(test_appointment_notifications())
