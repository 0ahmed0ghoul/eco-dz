# Quick Start: Email Booking Confirmations

## What's New

Users now receive **professional confirmation emails** when they book a trip!

```
✅ Customer Email (to booker):
   - Trip details (name, destination, dates)
   - Participants and pricing
   - Agency contact information
   - Booking confirmation

✅ Agency Email (to trip creator):
   - Customer contact details
   - Booking information
   - Reminder to contact customer
```

## Setup (2 minutes)

### Step 1: Get Email Credentials

**Gmail (FREE - Recommended for testing)**
1. Go to https://myaccount.google.com/security
2. Enable 2-Factor Authentication
3. Go to "App passwords" → Select Mail & Windows Computer
4. Copy the 16-character password

**Other Services**: Use your provider's SMTP settings

### Step 2: Update `.env`

Edit `backend/.env`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-16-char-app-password
```

### Step 3: Install & Run

```bash
cd backend
npm install
npm run dev
```

## Test It

1. Browse to trip booking page
2. Click "Book Now" on any trip
3. Fill in: participants, name, email, phone
4. Click "Complete Booking"
5. **Check email inbox** for confirmation! 📧

## How It Works

1. User completes booking form
2. Frontend sends data to `/api/bookings`
3. Backend validates trip & seats
4. **Emails sent to:**
   - Customer (confirmation with trip details)
   - Agency (notification about new booking)
5. Booking saved to `bookings.json`
6. Success message shown to user

## Email Contents

### Customer Gets:
- ✅ Trip name & destination
- 📅 Travel dates & duration  
- 👥 Number of participants
- 💰 Price breakdown & total
- 📧 Agency contact info
- 📝 Booking reference

### Agency Gets:
- 👤 Customer name, email, phone
- 🎯 Trip booked & date
- 👥 Number of participants
- 💵 Revenue amount
- ✉️ Reminder to contact customer

## Files Changed

```
backend/
  ├── services/
  │   └── email.service.js (NEW)
  ├── controllers/
  │   └── booking.controller.js (UPDATED)
  ├── routes/
  │   └── booking.routes.js (NEW)
  ├── app.js (UPDATED - added booking route)
  ├── .env (UPDATED - email config)
  └── package.json (UPDATED - added nodemailer)

frontend/
  └── src/pages/
      └── TripBooking.jsx (UPDATED - calls /api/bookings)
```

## Verify Setup

Check backend console after successful booking:
```
✅ Booking confirmation email sent to user@email.com
✅ Booking notification email sent to agency@email.com
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Email not sending | Check `.env` credentials are correct |
| "Invalid login" | Gmail app password wrong (use 16-char one, not regular password) |
| "Connection timeout" | Check SMTP_PORT=587 (not 25 or 465) |
| Email in spam | Mark as "Not spam" in email provider |

## Production Deployment

For live server:
1. Use SendGrid, AWS SES, or Mailgun (more reliable)
2. Update `.env` with production SMTP credentials
3. Ensure email address is verified with provider
4. Consider email templates with company branding

## Advanced Setup

See full documentation:
- `EMAIL_SETUP.md` - Detailed email configuration guide
- `BOOKING_EMAIL_IMPLEMENTATION.md` - Complete technical details

---

**That's it!** Your users will now receive beautiful confirmation emails after booking. 🎉
