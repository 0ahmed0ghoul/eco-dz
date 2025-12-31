# Agency System Documentation

## Overview
This ecotourism platform now includes a comprehensive agency system that allows users to become travel agencies and manage trips, while other users can discover agencies, add them to favorites, and subscribe to email notifications about new trips.

---

## Features

### 1. **Account Type Switching**
Users can convert their regular account to an agency account:
- **Component**: `AccountTypeSwitcher.jsx`
- Users provide: Agency Name, Description, Contact Email
- Stored in: `users.json` with role = "agency"
- Can only be done once per account

### 2. **Trip Management (Agency Only)**
Agencies can create and manage trips:
- **Component**: `CreateTrip.jsx`
- **Fields**:
  - Title, Description, Destination
  - Duration, Start Date, Price
  - Max Participants, Image URL
  - Multiple activities selection
- **Data**: Stored in `trips.json`
- **Automatic Notifications**: When a trip is created, all subscribers are notified via email

### 3. **Trip Discovery**
Users can browse all available trips:
- **Component**: `TripsList.jsx`
- Features:
  - Filter by all trips or favorites
  - View trip details (rating, reviews, current participants)
  - Add agencies to favorites with one click
  - Book trips (button ready for future implementation)

### 4. **Agency Directory**
Dedicated page to explore all travel agencies:
- **Component/Page**: `AgenciesPage.jsx`
- Shows:
  - Agency name and rating
  - Number of active trips
  - Featured trip previews
  - Subscription status for logged-in users

### 5. **Favorites System**
Users can favorite agencies to stay updated:
- **Data**: Stored in `favoriteAgencies.json`
- **Auto-subscription**: When a user favorites an agency, they're automatically subscribed to emails
- Can favorite/unfavorite from multiple places (trip cards, agency cards)

### 6. **Email Notification System**
Agencies can notify subscribers when they post new trips:
- **Data**: `emailSubscriptions.json`
- **Features**:
  - Automatic subscription when favoriting
  - Toggle notifications on/off
  - Unsubscribe button in emails
  - Email logs to console (production-ready for real email service)

---

## Backend Structure

### Routes: `/api/agency`

#### Authentication Required (Protected Routes)
```
POST   /switch-to-agency          - Convert user to agency
GET    /profile                   - Get user profile with role
POST   /trips                      - Create new trip (agency only)
GET    /favorites                  - Get user's favorite agencies
POST   /favorites                  - Add agency to favorites
DELETE /favorites/:agencyId        - Remove agency from favorites
POST   /subscriptions/toggle       - Toggle email notifications
GET    /subscriptions              - Get user's email subscriptions
```

#### Public Routes
```
GET    /trips                      - Get all trips
GET    /trips/:tripId              - Get single trip details
GET    /agency/:agencyId/trips     - Get trips by specific agency
PATCH  /unsubscribe/:token         - Unsubscribe from emails (token-based)
```

### Controllers: `agency.controller.js`

**Main Functions:**
- `switchToAgency()` - Convert account to agency
- `getUserProfile()` - Retrieve user role and agency info
- `createTrip()` - Create new trip (sends notifications)
- `getAllTrips()` - Fetch all trips
- `getTripsByAgency()` - Filter trips by agency
- `addFavoriteAgency()` - Add to favorites + auto-subscribe
- `removeFavoriteAgency()` - Remove from favorites
- `toggleEmailSubscription()` - Enable/disable notifications
- `unsubscribeFromEmails()` - Unsubscribe using token
- `notifySubscribers()` - Internal function (sends emails to subscribers)

---

## Data Structure

### trips.json
```json
{
  "id": "unique-id",
  "agencyId": "user-id",
  "agencyName": "Agency Name",
  "title": "Trip Title",
  "description": "Trip description",
  "destination": "Location",
  "duration": "5 days",
  "price": 450,
  "image": "https://...",
  "activities": ["hiking", "camping"],
  "maxParticipants": 20,
  "currentParticipants": 12,
  "startDate": "2025-02-15",
  "createdAt": "2025-01-10T10:30:00Z",
  "rating": 4.8,
  "reviews": 24
}
```

### favoriteAgencies.json
```json
{
  "id": "unique-id",
  "userId": "user-id",
  "agencyId": "agency-id",
  "agencyName": "Agency Name",
  "createdAt": "2025-01-12T15:30:00Z"
}
```

### emailSubscriptions.json
```json
{
  "id": "unique-id",
  "userId": "user-id",
  "agencyId": "agency-id",
  "agencyName": "Agency Name",
  "emailNotifications": true,
  "unsubscribeToken": "token-abc123",
  "createdAt": "2025-01-12T15:30:00Z"
}
```

---

## Frontend Components

### AccountTypeSwitcher.jsx
**Purpose**: Allow users to switch to agency role
**Location**: Use in profile/account settings page
```jsx
<AccountTypeSwitcher />
```

### CreateTrip.jsx
**Purpose**: Modal form for agencies to create trips
**Location**: Use globally (appears as floating button for agencies)
```jsx
<CreateTrip userProfile={profile} onTripCreated={handleNewTrip} />
```

### TripsList.jsx
**Purpose**: Browse and filter trips
**Location**: Use on a dedicated trips page
```jsx
<TripsList />
```

### EmailSubscriptions.jsx
**Purpose**: Manage email notification preferences
**Location**: Use on user settings/preferences page
```jsx
<EmailSubscriptions />
```

### AgenciesPage.jsx
**Purpose**: Explore all agencies and their trips
**Location**: Create route `/agencies`
```jsx
<AgenciesPage />
```

---

## Usage Examples

### For Users:
1. Login → Go to Profile → Click "Become an Agency"
2. Fill in agency details and confirm
3. Browse trips at `/trips` or `/agencies`
4. Click heart icon to favorite an agency
5. View notification preferences in settings

### For Agencies:
1. After switching to agency role
2. Click floating "New Trip" button
3. Fill in trip details
4. Click "Create Trip"
5. All subscribers get notified automatically

---

## Email Notification Example

**Subject**: New trip from Desert Dreams Agency!

**Body**:
```
New Trip Available!

Trip: Sahara Desert Expedition - Sahara Desert
Duration: 5 days
Price: $450

Manage notifications: [link to settings]
Unsubscribe: [unsubscribe link with token]
```

---

## Fake Data Included

**Pre-loaded Data**:
- 3 trips from 2 different agencies
- 3 favorite agency relationships
- 3 email subscriptions (all active)

**Easy to expand**:
- Simply add more objects to JSON files
- System scales automatically

---

## Customization Options

### Email Service Integration
Replace the console logging in `notifySubscribers()` with:
```javascript
// Using nodemailer or similar
const transporter = nodemailer.createTransport({...});
await transporter.sendMail({
  to: subscriber.email,
  subject: `New trip from ${agencyName}!`,
  html: emailTemplate
});
```

### Styling
- All components use Tailwind CSS
- Easy to customize colors, spacing, etc.
- Responsive design (mobile-first)

### Additional Features
- Ratings and reviews (ready to add)
- Trip booking system
- Payment integration
- Agency analytics dashboard

---

## Testing

### Manual Testing Checklist:
- [ ] Switch user to agency
- [ ] Create a trip as agency
- [ ] See notification in console
- [ ] Favorite an agency as regular user
- [ ] Check subscription created
- [ ] Toggle notifications on/off
- [ ] Visit agencies page
- [ ] Filter trips by favorites

---

## Future Enhancements

1. **Real Email Service**: Integrate Sendgrid, Mailgun, or AWS SES
2. **Trip Bookings**: Full booking system with payments
3. **Reviews & Ratings**: User reviews for trips/agencies
4. **Advanced Filters**: By price, duration, difficulty, season
5. **Agency Analytics**: Dashboard for agencies to track performance
6. **Messaging**: Direct messaging between users and agencies
7. **Calendar Integration**: Sync with Google Calendar, iCal

---

## Troubleshooting

**Issue**: "Only agencies can create trips"
- **Solution**: User needs to switch to agency role first

**Issue**: No email notifications
- **Solution**: Check console logs, user might be unsubscribed or notifications disabled

**Issue**: Favorite not showing up
- **Solution**: Ensure user is logged in, refresh page

---

## Support

For issues or questions about the agency system, check:
1. Browser console for API errors
2. Node.js console for backend logs
3. Verify auth token is stored in localStorage
4. Ensure all data files exist in `backend/data/`

