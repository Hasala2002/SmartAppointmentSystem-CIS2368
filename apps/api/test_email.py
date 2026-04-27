"""
Test script for email functionality
Run this to verify email sending works correctly
"""
import asyncio
import sys
import os

# Add the app directory to the path
sys.path.insert(0, os.path.dirname(__file__))

from app.services.email import (
    send_email,
    send_appointment_reminder,
    send_appointment_confirmation,
    send_appointment_cancellation
)
from app.config import settings


async def test_basic_email():
    """Test sending a basic email"""
    print("Testing basic email...")
    success = await send_email(
        to_email=settings.SMTP_USER,  # Send to yourself
        subject="Test Email - Lone Star Dental",
        body="This is a test email from the Lone Star Dental system.",
        html_body="<h1>Test Email</h1><p>This is a test email from the Lone Star Dental system.</p>"
    )
    if success:
        print("✓ Basic email sent successfully!")
    else:
        print("✗ Failed to send basic email")
    return success


async def test_appointment_reminder():
    """Test sending appointment reminder"""
    print("\nTesting appointment reminder...")
    success = await send_appointment_reminder(
        to_email=settings.SMTP_USER,  # Send to yourself
        patient_name="John Doe",
        appointment_date="April 15, 2026",
        appointment_time="2:00 PM",
        doctor_name="Dr. Smith"
    )
    if success:
        print("✓ Appointment reminder sent successfully!")
    else:
        print("✗ Failed to send appointment reminder")
    return success


async def test_appointment_confirmation():
    """Test sending appointment confirmation"""
    print("\nTesting appointment confirmation...")
    success = await send_appointment_confirmation(
        to_email=settings.SMTP_USER,  # Send to yourself
        patient_name="Jane Smith",
        appointment_date="April 20, 2026",
        appointment_time="10:00 AM",
        appointment_type="Cleaning",
        doctor_name="Dr. Johnson"
    )
    if success:
        print("✓ Appointment confirmation sent successfully!")
    else:
        print("✗ Failed to send appointment confirmation")
    return success


async def test_appointment_cancellation():
    """Test sending appointment cancellation"""
    print("\nTesting appointment cancellation...")
    success = await send_appointment_cancellation(
        to_email=settings.SMTP_USER,  # Send to yourself
        patient_name="Bob Wilson",
        appointment_date="April 25, 2026",
        appointment_time="3:30 PM"
    )
    if success:
        print("✓ Appointment cancellation sent successfully!")
    else:
        print("✗ Failed to send appointment cancellation")
    return success


async def main():
    print("=" * 60)
    print("Email System Test")
    print("=" * 60)
    print(f"SMTP Server: {settings.SMTP_HOST}:{settings.SMTP_PORT}")
    print(f"From: {settings.SMTP_FROM_EMAIL}")
    print(f"To: {settings.SMTP_USER}")
    print("=" * 60)
    
    results = []
    
    # Run all tests
    results.append(await test_basic_email())
    results.append(await test_appointment_reminder())
    results.append(await test_appointment_confirmation())
    results.append(await test_appointment_cancellation())
    
    # Summary
    print("\n" + "=" * 60)
    print("Test Summary")
    print("=" * 60)
    passed = sum(results)
    total = len(results)
    print(f"Passed: {passed}/{total}")
    
    if passed == total:
        print("✓ All tests passed! Email system is working correctly.")
        print("\nCheck your inbox at:", settings.SMTP_USER)
    else:
        print("✗ Some tests failed. Check your SMTP configuration.")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(main())
