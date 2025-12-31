# Email Configuration Guide

## Booking Confirmation Emails Setup

The system now sends confirmation emails when users complete trip bookings. Follow these steps to enable the email functionality:

### 1. Install Dependencies

The backend already has `nodemailer` in `package.json`. Install it:

```bash
cd backend
npm install
```

### 2. Set Up Email Credentials

#### Option A: Using Gmail (Recommended for Testing)

1. **Create a Gmail App Password:**
   - Go to [Google Account Security Settings](https://myaccount.google.com/security)
   - Enable 2-Factor Authentication if not already enabled
   - Go to **App passwords** (at the bottom of the security page)
   - Select **Mail** and **Windows Computer** (or your device)
   - Generate a new app password
   - Copy the 16-character password

2. **Update `.env` file in `/backend`:**

```env
# Email Configuration (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password
```

Replace:
- `your-email@gmail.com` with your actual Gmail address
- `your-16-character-app-password` with the app password from step 1

#### Option B: Using Other Email Services

For Outlook/Hotmail:
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

For SendGrid:
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=SG.your-sendgrid-api-key
```

### 3. How Email Sending Works

When a user completes a booking:

1. **Customer Email**: Receives booking confirmation with:
   - Trip name, dates, and destination
   - Number of participants and total price
   - Agency contact information
   - Booking reference

2. **Agency Email**: Receives notification with:
   - Customer contact information
   - Booking details
   - Trip information

### 4. Email Service Files

- **`backend/services/email.service.js`**: Contains email templates and sending functions
  - `sendBookingConfirmation()`: Sends email to customer
  - `sendBookingNotificationToAgency()`: Sends notification to agency

- **`backend/controllers/booking.controller.js`**: Handles booking creation and triggers emails
  - `createBooking()`: Creates booking and sends both emails
  - `getUserBookings()`: Retrieves user's booking history

- **`backend/routes/booking.routes.js`**: API endpoints
  - `POST /api/bookings`: Create new booking
  - `GET /api/bookings/user`: Get user's bookings

### 5. Frontend Integration

**`frontend/src/pages/TripBooking.jsx`** - Booking page that:
- Shows trip details with image gallery
- Displays available seats with warnings
- Booking form with participant count, name, email, phone
- Calls `/api/bookings` to create booking when "Complete Booking" is clicked

## Testing Emails

### Local Testing

For testing without real email service:

1. Use [Ethereal Email](https://ethereal.email/) (free, temporary email service)
   - Create account and copy SMTP credentials
   - Add to `.env` file
   - Emails will be captured but not sent

2. Check browser console for booking confirmation message

### Production Testing

1. Set up real Gmail/SendGrid credentials in `.env`
2. Complete a booking with a real email address
3. Check the inbox for confirmation email

## Troubleshooting

### Email Not Sending?

1. **Check logs**: Look at backend console output for error messages
2. **Verify credentials**: Test SMTP connection
3. **Check email limits**: Gmail limits 500 emails/day for new accounts
4. **Check spam folder**: Confirmation email might be marked as spam

### Common Errors

- **"Invalid login"**: Wrong email/password in `.env`
- **"Less secure apps"**: Enable "Less secure app access" in Gmail security settings
- **"SMTP connection timeout"**: Firewall blocking SMTP port 587

## Email Templates

Both emails use professional HTML templates with:
- Branded header with confirmation status
- Trip information section
- Booking details with pricing
- Agency contact information
- Professional footer

Templates are fully customizable in `backend/services/email.service.js`

## Security Notes

- Never commit `.env` file with real credentials to version control
- Use App Passwords instead of main Gmail password
- For production, use SendGrid or similar enterprise service
- Consider adding email verification for confirmation
