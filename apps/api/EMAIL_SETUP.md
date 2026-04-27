# Email Notification Setup

## Overview
Email notifications have been integrated into the appointment system using Gmail SMTP. Emails are sent automatically when appointments are created, rescheduled, or cancelled.

## Configuration

### SMTP Settings
The following environment variables are configured in `.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=hhasala2002@gmail.com
SMTP_PASSWORD=txyw ekto ijrm bcrc
SMTP_FROM_EMAIL=hhasala2002@gmail.com
```

### Dependencies
- `aiosmtplib==3.0.1` - Async SMTP library for Python

## Email Service

### Location
`apps/api/app/services/email.py`

### Available Functions

#### 1. `send_email(to_email, subject, body, html_body)`
Generic email sender that supports both plain text and HTML emails.

#### 2. `send_appointment_confirmation(to_email, patient_name, appointment_date, appointment_time, appointment_type, doctor_name)`
Sends a styled confirmation email when an appointment is booked or rescheduled.

#### 3. `send_appointment_reminder(to_email, patient_name, appointment_date, appointment_time, doctor_name)`
Sends a reminder email before an appointment (typically used with scheduled tasks).

#### 4. `send_appointment_cancellation(to_email, patient_name, appointment_date, appointment_time)`
Sends a cancellation notice when an appointment is cancelled.

#### 5. `send_queue_called_email(to_email, patient_name, queue_number, location_name)`
Sends an email when a customer is called from the waiting queue.

## Integration Points

### Notification Service
`apps/api/app/services/notification_service.py`

The notification service has been updated to send both push notifications AND emails:

- `send_appointment_confirmed_notification()` - Sends push + email confirmation
- `send_appointment_reminder_notification()` - Sends push + email reminder
- `send_appointment_cancelled_notification()` - Sends push + email cancellation
- `send_queue_called_notification()` - Sends push + email when customer is called

### Appointments Router
`apps/api/app/routers/appointments.py`

Automatic email notifications are triggered in these endpoints:

1. **POST `/api/v1/appointments/`** - Creating a new appointment
   - Sends confirmation email to the customer

2. **PATCH `/api/v1/appointments/{id}/reschedule`** - Rescheduling an appointment
   - Sends confirmation email with new date/time

3. **PATCH `/api/v1/appointments/{id}/cancel`** - Cancelling an appointment
   - Sends cancellation notice to the customer

### Queue Service
Automatic email notifications are also triggered in the queue system:

1. **Queue Called** - When a customer's number is called
   - Sends "You're Up!" email with queue number and location

## Email Templates

All emails include:
- Professional HTML formatting with inline CSS
- Responsive design for mobile devices
- Lone Star Dental branding
- Clear appointment details
- Footer with automated message disclaimer

### Template Colors
- **Confirmation**: Green (#10b981)
- **Reminder**: Blue (#2563eb)
- **Cancellation**: Red (#ef4444)
- **Queue Called**: Orange (#f59e0b)

## Testing

### Test Email Functionality
Run the basic email test:
```bash
python test_email.py
```

### Test Appointment Integration
Run the appointment email integration test:
```bash
python test_appointment_emails.py
```

### Test Queue Notification
Run the queue email notification test:
```bash
python test_queue_email.py
```

All tests send emails to `hhasala2002@gmail.com`.

## Error Handling

Email sending is wrapped in try-catch blocks to ensure:
- Appointment operations don't fail if email sending fails
- Errors are logged to console for debugging
- Users still receive push notifications even if email fails

## Future Enhancements

### Recommended Additions:
1. **Scheduled Reminders**: Set up a cron job or background task to send reminder emails 24 hours before appointments
2. **Email Queue**: Implement a job queue (e.g., Celery) for better email delivery reliability
3. **Email Templates**: Move templates to separate HTML files for easier editing
4. **Unsubscribe**: Add email preference management for users
5. **Email Tracking**: Track email open rates and delivery status
6. **Staff Notifications**: Send emails to staff when appointments are created/cancelled

## Security Notes

⚠️ **Important**: The Gmail app password in `.env` should be kept secure and never committed to version control. Consider using environment-specific secrets management in production.

## Troubleshooting

### Emails Not Sending
1. Check SMTP credentials in `.env`
2. Verify Gmail app password is correct
3. Check console logs for error messages
4. Ensure `aiosmtplib` is installed in venv

### Email Going to Spam
1. Set up SPF/DKIM records for your domain
2. Use a dedicated email service (SendGrid, Mailgun) for production
3. Keep email content professional and avoid spam trigger words

### Testing Locally
- Use a fake SMTP server like `smtp4dev` for local testing without sending real emails
- Or continue using Gmail for development and testing
