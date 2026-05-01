import aiosmtplib
from email.message import EmailMessage
from app.config import settings
import logging

logger = logging.getLogger(__name__)


def _smtp_configured() -> bool:
    """Return True only when all required SMTP credentials are present."""
    return bool(
        settings.SMTP_HOST
        and settings.SMTP_USER
        and settings.SMTP_PASSWORD
        and settings.SMTP_FROM_EMAIL
    )


async def send_email(
    to_email: str,
    subject: str,
    body: str,
    html_body: str = None
):
    """
    Send an email via SMTP (STARTTLS on port 587).

    Returns True on success, False on failure or when SMTP is not configured.
    Credentials are read exclusively from environment variables – never from a
    hard-coded .env file inside the container.
    """
    if not _smtp_configured():
        logger.warning(
            "SMTP is not configured (SMTP_HOST / SMTP_USER / SMTP_PASSWORD / "
            "SMTP_FROM_EMAIL are not all set). Skipping email to %s.", to_email
        )
        return False

    try:
        message = EmailMessage()
        message["From"] = settings.SMTP_FROM_EMAIL
        message["To"] = to_email
        message["Subject"] = subject

        # Plain-text fallback is always set first
        message.set_content(body)

        # Attach the richer HTML alternative when provided
        if html_body:
            message.add_alternative(html_body, subtype="html")

        # Connect with STARTTLS (plain connection upgraded to TLS).
        # use_tls=False means we do NOT try an implicit TLS handshake on
        # connect; start_tls=True tells aiosmtplib to issue STARTTLS after
        # the initial greeting, which is the standard for port 587.
        await aiosmtplib.send(
            message,
            hostname=settings.SMTP_HOST,
            port=settings.SMTP_PORT,
            username=settings.SMTP_USER,
            password=settings.SMTP_PASSWORD,
            use_tls=False,
            start_tls=True,
        )

        logger.info("Email sent successfully to %s", to_email)
        return True

    except Exception as e:
        logger.error("Failed to send email to %s: %s", to_email, str(e))
        return False


async def send_appointment_reminder(
    to_email: str,
    patient_name: str,
    appointment_date: str,
    appointment_time: str,
    doctor_name: str = None
):
    """Send appointment reminder email"""
    
    subject = "Appointment Reminder - Lone Star Dental"
    
    body = f"""
Dear {patient_name},

This is a reminder of your upcoming appointment at Lone Star Dental.

Appointment Details:
- Date: {appointment_date}
- Time: {appointment_time}
{f'- Doctor: {doctor_name}' if doctor_name else ''}

Please arrive 10 minutes early to complete any necessary paperwork.

If you need to reschedule or cancel, please contact us as soon as possible.

Thank you,
Lone Star Dental Team
"""
    
    html_body = f"""
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background-color: #2563eb; color: white; padding: 20px; text-align: center; }}
        .content {{ background-color: #f9fafb; padding: 20px; border-radius: 5px; margin-top: 20px; }}
        .details {{ background-color: white; padding: 15px; border-left: 4px solid #2563eb; margin: 15px 0; }}
        .footer {{ text-align: center; margin-top: 20px; color: #666; font-size: 12px; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Appointment Reminder</h1>
        </div>
        <div class="content">
            <p>Dear {patient_name},</p>
            <p>This is a reminder of your upcoming appointment at Lone Star Dental.</p>
            
            <div class="details">
                <h3>Appointment Details:</h3>
                <p><strong>Date:</strong> {appointment_date}</p>
                <p><strong>Time:</strong> {appointment_time}</p>
                {f'<p><strong>Branch:</strong> {doctor_name}</p>' if doctor_name else ''}
            </div>
            
            <p>Please arrive 10 minutes early to complete any necessary paperwork.</p>
            <p>If you need to reschedule or cancel, please contact us as soon as possible.</p>
            
            <p>Thank you,<br><strong>Lone Star Dental Team</strong></p>
        </div>
        <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
"""
    
    return await send_email(to_email, subject, body, html_body)


async def send_appointment_confirmation(
    to_email: str,
    patient_name: str,
    appointment_date: str,
    appointment_time: str,
    appointment_type: str,
    doctor_name: str = None
):
    """Send appointment confirmation email"""
    
    subject = "Appointment Confirmed - Lone Star Dental"
    
    body = f"""
Dear {patient_name},

Your appointment has been confirmed!

Appointment Details:
- Type: {appointment_type}
- Date: {appointment_date}
- Time: {appointment_time}
{f'- Doctor: {doctor_name}' if doctor_name else ''}

We look forward to seeing you!

Thank you,
Lone Star Dental Team
"""
    
    html_body = f"""
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background-color: #10b981; color: white; padding: 20px; text-align: center; }}
        .content {{ background-color: #f9fafb; padding: 20px; border-radius: 5px; margin-top: 20px; }}
        .details {{ background-color: white; padding: 15px; border-left: 4px solid #10b981; margin: 15px 0; }}
        .footer {{ text-align: center; margin-top: 20px; color: #666; font-size: 12px; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✓ Appointment Confirmed</h1>
        </div>
        <div class="content">
            <p>Dear {patient_name},</p>
            <p>Your appointment has been confirmed!</p>
            
            <div class="details">
                <h3>Appointment Details:</h3>
                <p><strong>Type:</strong> {appointment_type}</p>
                <p><strong>Date:</strong> {appointment_date}</p>
                <p><strong>Time:</strong> {appointment_time}</p>
                {f'<p><strong>Branch:</strong> {doctor_name}</p>' if doctor_name else ''}
            </div>
            
            <p>We look forward to seeing you!</p>
            
            <p>Thank you,<br><strong>Lone Star Dental Team</strong></p>
        </div>
        <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
"""
    
    return await send_email(to_email, subject, body, html_body)


async def send_appointment_cancellation(
    to_email: str,
    patient_name: str,
    appointment_date: str,
    appointment_time: str
):
    """Send appointment cancellation email"""
    
    subject = "Appointment Cancelled - Lone Star Dental"
    
    body = f"""
Dear {patient_name},

Your appointment scheduled for {appointment_date} at {appointment_time} has been cancelled.

If you would like to reschedule, please contact us or book a new appointment through our website.

Thank you,
Lone Star Dental Team
"""
    
    html_body = f"""
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background-color: #ef4444; color: white; padding: 20px; text-align: center; }}
        .content {{ background-color: #f9fafb; padding: 20px; border-radius: 5px; margin-top: 20px; }}
        .details {{ background-color: white; padding: 15px; border-left: 4px solid #ef4444; margin: 15px 0; }}
        .footer {{ text-align: center; margin-top: 20px; color: #666; font-size: 12px; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Appointment Cancelled</h1>
        </div>
        <div class="content">
            <p>Dear {patient_name},</p>
            
            <div class="details">
                <p>Your appointment scheduled for <strong>{appointment_date}</strong> at <strong>{appointment_time}</strong> has been cancelled.</p>
            </div>
            
            <p>If you would like to reschedule, please contact us or book a new appointment through our website.</p>
            
            <p>Thank you,<br><strong>Lone Star Dental Team</strong></p>
        </div>
        <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
"""
    
    return await send_email(to_email, subject, body, html_body)


async def send_queue_called_email(
    to_email: str,
    patient_name: str,
    queue_number: str,
    location_name: str
):
    """Send email when customer is called from queue"""
    
    subject = "You're Up! - Lone Star Dental"
    
    body = f"""
Dear {patient_name},

Your turn has arrived!

Queue Number: {queue_number}

Please proceed to the counter at {location_name}.

Thank you for your patience!

Lone Star Dental Team
"""
    
    html_body = f"""
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background-color: #f59e0b; color: white; padding: 20px; text-align: center; }}
        .content {{ background-color: #f9fafb; padding: 20px; border-radius: 5px; margin-top: 20px; }}
        .queue-number {{ background-color: #fef3c7; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0; border: 3px solid #f59e0b; }}
        .queue-number h2 {{ color: #f59e0b; font-size: 36px; margin: 0; }}
        .details {{ background-color: white; padding: 15px; border-left: 4px solid #f59e0b; margin: 15px 0; }}
        .footer {{ text-align: center; margin-top: 20px; color: #666; font-size: 12px; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🦷 You're Up!</h1>
        </div>
        <div class="content">
            <p>Dear {patient_name},</p>
            <p><strong>Your turn has arrived!</strong></p>
            
            <div class="queue-number">
                <p style="margin: 0; font-size: 14px; color: #78350f;">Queue Number</p>
                <h2>{queue_number}</h2>
            </div>
            
            <div class="details">
                <p style="font-size: 18px; margin: 0;">📍 Please proceed to the counter at <strong>{location_name}</strong></p>
            </div>
            
            <p>Thank you for your patience!</p>
            
            <p>Best regards,<br><strong>Lone Star Dental Team</strong></p>
        </div>
        <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
"""
    
    return await send_email(to_email, subject, body, html_body)
