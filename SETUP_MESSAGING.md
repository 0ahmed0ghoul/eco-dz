# Real-Time Messaging System - Quick Setup Guide

## What Was Built

A complete **real-time messaging system** with two key features:

### 1. **Direct User Messaging** (Inbox)
- Users can send private messages to each other
- Full message history
- Conversation list with search
- Unread count badges
- Real-time updates via Socket.io

### 2. **Support Chat** (Help System)
- Users create support tickets for help with bookings/destinations
- Real-time chat with support team
- Ticket categories and status tracking
- Admin can respond to tickets

---

## Database Setup

Run this SQL to create the required tables:

```sql
-- Conversations table (for direct messaging)
CREATE TABLE conversations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user1_id INT NOT NULL,
  user2_id INT NOT NULL,
  last_message_at TIMESTAMP,
  FOREIGN KEY (user1_id) REFERENCES users(id),
  FOREIGN KEY (user2_id) REFERENCES users(id)
);

-- Messages table
CREATE TABLE messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  conversation_id INT NOT NULL,
  sender_id INT NOT NULL,
  message_text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id),
  FOREIGN KEY (sender_id) REFERENCES users(id)
);

-- Support tickets table
CREATE TABLE support_tickets (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  subject VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50),
  status VARCHAR(50) DEFAULT 'open',
  priority VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Support messages table
CREATE TABLE support_messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  ticket_id INT NOT NULL,
  sender_id INT NOT NULL,
  message_text TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ticket_id) REFERENCES support_tickets(id),
  FOREIGN KEY (sender_id) REFERENCES users(id)
);
```

---

## Backend Setup

### 1. Install Socket.io
```bash
cd backend
npm install socket.io
```

### 2. Files Already Created:
- ✅ `socket/socket.js` - WebSocket event handlers
- ✅ `controllers/messaging.controller.js` - API logic
- ✅ `routes/messaging.routes.js` - API routes
- ✅ `app.js` - Updated for Socket.io

---

## Frontend Setup

### 1. Install Socket.io Client
```bash
cd frontend
npm install socket.io-client
```

### 2. Files Already Created:
- ✅ `src/components/Inbox.jsx` - Direct messaging UI
- ✅ `src/components/Chat.jsx` - Chat display
- ✅ `src/components/SupportChat.jsx` - Support tickets UI
- ✅ `src/App.jsx` - Routes configured

### 3. Routes Available:
- `/inbox` - Direct messaging
- `/support` - Support chat

---

## How to Use

### **Direct Messaging (User to User)**

1. Click **mail icon** in navbar → goes to `/inbox`
2. Click **+** button to start new chat
3. Enter the other user's ID
4. Start chatting in real-time!

**Features:**
- Messages save automatically
- See unread count on mail icon
- Search conversations by username
- Message history loads when opening conversation

### **Support Chat (Get Help)**

1. Click mail icon → **Click link to support chat** (route: `/support`)
2. Click **+** button to create new ticket
3. Fill: Subject, Description, Category
4. Start chatting with support team!

**Features:**
- Categorize: General, Booking, Destination, Complaint
- Track ticket status: Open, In Progress, Resolved, Closed
- Support team responds in real-time
- Full message history

---

## API Endpoints

### Direct Messaging
```
POST   /api/messaging/conversations              # Create/get conversation
GET    /api/messaging/conversations              # Get all user conversations
GET    /api/messaging/conversations/:id/messages # Get message history
```

### Support Tickets
```
POST   /api/messaging/support/tickets            # Create ticket
GET    /api/messaging/support/tickets            # Get user's tickets
GET    /api/messaging/support/tickets/:id        # Get ticket + messages
```

### Admin Only
```
GET    /api/messaging/support/tickets/admin/all  # All system tickets
POST   /api/messaging/support/tickets/:id/respond # Reply to ticket
```

---

## Testing

### Test Direct Messaging
1. Open two browser windows/tabs
2. Log in as **User A** in one, **User B** in other
3. Go to `/inbox` in both
4. From User A: Create conversation with User B (use their ID)
5. Send message from User A → Should appear instantly in User B
6. User B replies → Should appear instantly in User A

### Test Support Chat
1. Go to `/support`
2. Click **+** button
3. Create ticket with subject + description
4. Send message
5. Message saves to database with timestamp

---

## Real-Time Features (Socket.io)

### What Happens in Real-Time:
- ✅ Messages appear instantly (no page refresh needed)
- ✅ Typing indicators show when other person is typing
- ✅ Online/offline status updates
- ✅ Support tickets get instant responses

### How It Works:
- Frontend connects to backend via WebSocket (Socket.io)
- When you send a message → Emitted via socket
- Backend saves to database + broadcasts to recipient
- Recipient receives message instantly without refresh

---

## Security

All endpoints are **protected with JWT authentication**:
- Must include valid token in Authorization header
- Socket.io also verifies token on connection
- User can only see their own conversations/tickets

---

## Troubleshooting

### "Socket not connected" error?
- Make sure backend is running on port 5000
- Check `.env` has correct `PORT=5000`
- Verify `socket.js` is initialized in `app.js`

### Messages not appearing?
- Check browser console for errors
- Verify database tables created
- Ensure token is valid

### Support chat not loading?
- Check `/api/messaging/support/tickets` endpoint
- Verify tables exist in database
- Check auth middleware is working

---

## File Locations

```
backend/
├── socket/socket.js
├── controllers/messaging.controller.js
├── routes/messaging.routes.js
└── app.js (updated)

frontend/
├── src/components/
│   ├── Inbox.jsx
│   ├── Chat.jsx
│   └── SupportChat.jsx
└── src/App.jsx (updated)
```

---

## Next Steps (Optional Enhancements)

1. **Message Reactions** - Add emoji reactions to messages
2. **File Sharing** - Upload files/images in chat
3. **Admin Dashboard** - View all support tickets
4. **Read Receipts** - Show "seen" status
5. **Group Chats** - Multiple users in one conversation
6. **Push Notifications** - Notify on new messages
7. **Message Search** - Search through chat history

---

## Summary

✅ Full messaging system with **direct messaging** and **support chat**
✅ Real-time updates via Socket.io
✅ Database persistence
✅ JWT authentication
✅ Responsive UI with Tailwind CSS
✅ Ready to use!

**Start using it:**
1. Click mail icon in navbar
2. Go to `/inbox` for direct messaging
3. Go to `/support` for support tickets
