# Quick Implementation Guide - Agency System

## 📋 What's Been Created

### Backend (Node.js + Express)
✅ **New Routes**: `/api/agency/*`
✅ **New Controller**: `backend/controllers/agency.controller.js`
✅ **Data Files**: 
   - `trips.json` - All trips with fake data
   - `favoriteAgencies.json` - User favorites
   - `emailSubscriptions.json` - Email preferences

### Frontend (React + Tailwind)
✅ **Components**:
   - `AccountTypeSwitcher.jsx` - Role switching
   - `CreateTrip.jsx` - Trip creation (agencies)
   - `TripsList.jsx` - Browse trips
   - `EmailSubscriptions.jsx` - Notification preferences
   - `AgenciesPage.jsx` - Agency directory

✅ **Styling**: Full Tailwind CSS design

---

## 🚀 How to Use

### 1. **Add Components to Your App**

**In your main App.jsx**, import and add the components:

```jsx
import AccountTypeSwitcher from "./components/AccountTypeSwitcher";
import TripsList from "./components/TripsList";
import EmailSubscriptions from "./components/EmailSubscriptions";
import CreateTrip from "./components/CreateTrip";
import AgenciesPage from "./pages/Agencies";
```

### 2. **Create Routes**

Add these routes to your App.jsx Routes:

```jsx
<Route path="/account" element={<AccountTypeSwitcher />} />
<Route path="/trips" element={<TripsList />} />
<Route path="/agencies" element={<AgenciesPage />} />
<Route path="/settings/notifications" element={<EmailSubscriptions />} />
```

### 3. **Add to Profile Page**

Include `AccountTypeSwitcher` in your user profile/settings:

```jsx
// In your profile page
<AccountTypeSwitcher />
<EmailSubscriptions />
```

### 4. **Add Create Trip Button**

Include `CreateTrip` at the root level so it appears everywhere for agencies:

```jsx
// In your main App.jsx
<CreateTrip userProfile={userProfile} onTripCreated={handleNewTrip} />
```

---

## 💾 Backend Setup

### 1. Add to app.js (Already Done)
Route is already imported and registered:
```javascript
app.use("/api/agency", agencyRoutes);
```

### 2. Start Backend
```bash
cd backend
npm run dev
```

### 3. Test API Endpoints
- POST `/api/agency/switch-to-agency` - Switch account type
- GET `/api/agency/trips` - Get all trips
- POST `/api/agency/trips` - Create trip
- POST `/api/agency/favorites` - Add favorite
- GET `/api/agency/subscriptions` - View email subscriptions

---

## 🎨 Customization

### Change Colors
Replace `emerald` with your brand color in Tailwind classes:
```jsx
// From:
className="bg-emerald-600"
// To:
className="bg-blue-600"
```

### Add More Activities
Edit available activities in `CreateTrip.jsx`:
```javascript
const availableActivities = [
  // Add your activities here
  { id: 'new-activity', label: 'New Activity' }
];
```

### Modify Trip Fields
Edit the form in `CreateTrip.jsx` to add/remove fields

---

## 📧 Email Notifications

### Current Implementation
- Logs to console (see Node terminal)
- Ready for real email service integration

### To Add Real Emails
1. Install email package: `npm install nodemailer`
2. Update `notifySubscribers()` in `agency.controller.js`:

```javascript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// In notifySubscribers() function:
await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: subscriber.email,
  subject: `New trip from ${agencyName}!`,
  html: `<h2>${trip.title}</h2><p>${trip.description}</p>...`
});
```

---

## 🧪 Testing the System

### Step 1: Create an Account
- Register a new user (existing flow)

### Step 2: Become an Agency
- Navigate to account/profile
- Click "Become an Agency"
- Fill in agency details
- Confirm

### Step 3: Create a Trip
- See floating "New Trip" button
- Click it
- Fill in trip details
- Click "Create Trip"
- **Check Node console** for email notification logs

### Step 4: As Another User
- Login as different user
- Go to `/trips` or `/agencies`
- Click heart to favorite an agency
- Go to `/settings/notifications` to manage subscriptions

---

## 📊 Database Schema

### Users Table (Enhanced)
```json
{
  "id": "user-id",
  "username": "username",
  "email": "email@example.com",
  "password": "hashed-password",
  "role": "user" || "agency",
  "agencyName": "Optional - only if agency",
  "agencyDescription": "Optional - only if agency",
  "agencyContact": "Optional - only if agency"
}
```

---

## 🔒 Security Notes

✅ All agency endpoints protected with `authMiddleware`
✅ Only agencies can create trips (role check)
✅ Unsubscribe link uses tokens (no auth needed)
✅ Favorites are user-specific

---

## 🚨 Common Issues & Fixes

### Issue: "User not found"
- Make sure you're logged in
- Check auth token in localStorage

### Issue: "Only agencies can create trips"
- You need to switch to agency role first
- Visit AccountTypeSwitcher

### Issue: No email notifications appear
- Check Node terminal/console (not browser console)
- Make sure you favorited the agency first

### Issue: Styling looks off
- Ensure Tailwind CSS is properly configured
- Check that tailwind.config.js includes src/ folder

---

## 📱 Responsive Design

All components are fully responsive:
- ✅ Mobile-first design
- ✅ Tablet optimized
- ✅ Desktop enhanced

Test on different screen sizes - everything should work smoothly!

---

## 🎯 Next Steps

1. **Integrate into your main App**: Add routes and components
2. **Test all features**: Follow testing guide above
3. **Customize styling**: Adjust Tailwind colors/spacing
4. **Add booking system**: Ready for next phase
5. **Setup real emails**: Use nodemailer or SendGrid

---

## 💡 Pro Tips

- Use React Developer Tools to debug component state
- Check Network tab to see API calls
- Use browser DevTools to inspect localStorage (auth token)
- Scale fake data by adding more JSON objects
- Use Tailwind's `dark:` prefix for dark mode support

---

## 📞 Support

All code is fully commented and follows best practices. If you need to modify:

1. **API endpoints**: Edit `backend/routes/agency.routes.js`
2. **Business logic**: Edit `backend/controllers/agency.controller.js`
3. **UI**: Edit React components in `frontend/src/components/`
4. **Styling**: Modify Tailwind classes in components

---

**Happy coding! 🚀**
