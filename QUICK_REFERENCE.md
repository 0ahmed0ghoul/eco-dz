# Real-Time Messaging System - Quick Reference Card

## 🎯 What to Do First

### Step 1: Database Setup
```sql
-- Run this SQL in MySQL:
CREATE TABLE conversations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user1_id INT NOT NULL,
  user2_id INT NOT NULL,
  last_message_at TIMESTAMP,
  FOREIGN KEY (user1_id) REFERENCES users(id),
  FOREIGN KEY (user2_id) REFERENCES users(id)
);

CREATE TABLE messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  conversation_id INT NOT NULL,
  sender_id INT NOT NULL,
  message_text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id),
  FOREIGN KEY (sender_id) REFERENCES users(id)
);

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

### Step 2: Backend Setup
```bash
cd backend
npm install socket.io
npm start
# Wait for: "Server running on port 5000"
```

### Step 3: Frontend Setup
```bash
cd frontend
npm install socket.io-client
npm run dev
# Opens http://localhost:5173
```

### Step 4: Test
- Login with test user
- Click mail icon in navbar
- Click "+" to create conversation
- Enter another user's ID
- Send message
- See it appear instantly! ✨

---

## 🔗 Routes

### User Routes
```
GET    /inbox               # Direct messaging page
GET    /support             # Support chat page
```

### API Routes
```
POST   /api/messaging/conversations              # Create chat
GET    /api/messaging/conversations              # Get chats
GET    /api/messaging/conversations/:id/messages # Get history

POST   /api/messaging/support/tickets            # Create ticket
GET    /api/messaging/support/tickets            # Get tickets
GET    /api/messaging/support/tickets/:id        # Get ticket details
```

---

## 📁 Key Files

| File | Purpose | Status |
|------|---------|--------|
| `backend/socket/socket.js` | Real-time events | ✅ Created |
| `backend/controllers/messaging.controller.js` | API logic | ✅ Created |
| `backend/routes/messaging.routes.js` | API routes | ✅ Created |
| `frontend/src/components/Inbox.jsx` | Message list | ✅ Created |
| `frontend/src/components/Chat.jsx` | Chat display | ✅ Created |
| `frontend/src/components/SupportChat.jsx` | Support UI | ✅ Created |
| `backend/app.js` | Server setup | ✅ Updated |
| `frontend/src/App.jsx` | Routes | ✅ Updated |
| `frontend/src/components/Navbar.jsx` | Mail icon | ✅ Updated |

---

## 💬 How It Works

### Sending a Message
```
1. User types in Chat component
2. Clicks Send button
3. Frontend emits: socket.emit("send-message", {conversationId, message})
4. Backend receives event
5. Backend saves to database
6. Backend broadcasts: io.to("conversation-X").emit("message-received", message)
7. Other user receives in real-time
8. Message appears on screen ✨
```

### Creating Support Ticket
```
1. User clicks "+" button
2. Fills: Subject, Description, Category
3. Clicks Create Ticket
4. Frontend POST to /api/messaging/support/tickets
5. Backend creates in database
6. Ticket appears in list
7. User can chat with support team
```

---

## 🛠️ Common Commands

### Check if Running
```bash
# Backend
curl http://localhost:5000/health

# Frontend
curl http://localhost:5173

# Database
mysql -u root -p -e "SELECT * FROM conversations;"
```

### Install Dependencies
```bash
cd backend && npm install socket.io
cd frontend && npm install socket.io-client
```

### Start Services
```bash
# Terminal 1 - Backend
cd backend && npm start

# Terminal 2 - Frontend
cd frontend && npm run dev

# Terminal 3 - MySQL (if needed)
mysql -u root -p
```

### Test API
```bash
# Create conversation
curl -X POST http://localhost:5000/api/messaging/conversations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"otherUserId": 2}'

# Get conversations
curl http://localhost:5000/api/messaging/conversations \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🔐 Authentication

### Required Headers
```javascript
// For HTTP requests:
headers: {
  "Authorization": "Bearer your_jwt_token_here",
  "Content-Type": "application/json"
}

// For Socket.io:
const socket = io("http://localhost:5000", {
  auth: {
    token: "your_jwt_token_here"
  }
});
```

### Get Token
```javascript
const token = localStorage.getItem("authToken");
```

---

## 📊 Database Schema Quick View

### Conversations Table
| Column | Type | Notes |
|--------|------|-------|
| id | INT | Primary Key |
| user1_id | INT | Foreign Key to users |
| user2_id | INT | Foreign Key to users |
| last_message_at | TIMESTAMP | Latest message time |

### Messages Table
| Column | Type | Notes |
|--------|------|-------|
| id | INT | Primary Key |
| conversation_id | INT | Foreign Key |
| sender_id | INT | Foreign Key to users |
| message_text | TEXT | Message content |
| created_at | TIMESTAMP | Sent time |

### Support_Tickets Table
| Column | Type | Notes |
|--------|------|-------|
| id | INT | Primary Key |
| user_id | INT | Foreign Key to users |
| subject | VARCHAR | Ticket title |
| description | TEXT | Issue description |
| category | VARCHAR | general\|booking\|destination\|complaint |
| status | VARCHAR | open\|in_progress\|resolved\|closed |
| priority | VARCHAR | high\|normal\|low |
| created_at | TIMESTAMP | Created time |

### Support_Messages Table
| Column | Type | Notes |
|--------|------|-------|
| id | INT | Primary Key |
| ticket_id | INT | Foreign Key |
| sender_id | INT | Foreign Key to users |
| message_text | TEXT | Message content |
| is_admin | BOOLEAN | Admin flag |
| created_at | TIMESTAMP | Sent time |

---

## 🎮 Component Props

### Chat Component
```javascript
<Chat 
  conversationId={1}           // ID of conversation
  otherUserName="John Doe"     // Other person's name
  otherUserId={2}              // Other person's ID
/>
```

### Inbox Component
```javascript
<Inbox />
// No props needed
// Uses localStorage for auth token
```

### SupportChat Component
```javascript
<SupportChat />
// No props needed
// Uses localStorage for auth token
```

---

## ⚡ Socket.io Events

### Emit Events (Frontend → Backend)
```javascript
socket.emit("send-message", {
  conversationId: 1,
  senderId: 1,
  message: "Hello!"
});

socket.emit("typing", {
  conversationId: 1,
  isTyping: true
});

socket.emit("join-conversation", 1);

socket.emit("send-support-message", {
  ticketId: 5,
  senderId: 1,
  message: "Need help!",
  isAdmin: false
});
```

### Listen Events (Backend → Frontend)
```javascript
socket.on("message-received", (message) => {
  // Handle received message
});

socket.on("typing", (data) => {
  // Handle typing indicator
});

socket.on("support-message-received", (message) => {
  // Handle support response
});

socket.on("user-online", (data) => {
  // User came online
});

socket.on("user-offline", (data) => {
  // User went offline
});
```

---

## ❌ Error Solutions

| Error | Solution |
|-------|----------|
| **Connection refused** | Backend not running on port 5000 |
| **401 Unauthorized** | Invalid or missing auth token |
| **CORS error** | Frontend URL not in CORS config |
| **No messages** | Check database tables exist |
| **Socket not connected** | Check auth token in localStorage |
| **Cannot find module** | Run `npm install` in backend/frontend |
| **Database error** | Check MySQL is running and credentials |
| **Message not saving** | Verify conversation_id is valid |

---

## 📚 Documentation Files

```
📄 COMPLETE_SUMMARY.md
   → Full overview of entire system

📄 README_MESSAGING.md
   → What was built & how to use

📄 SETUP_MESSAGING.md
   → Step-by-step setup guide

📄 MESSAGING_SYSTEM.md
   → Complete technical documentation

📄 API_EXAMPLES.md
   → API request examples & cURL

📄 IMPLEMENTATION_CHECKLIST.md
   → Implementation status

📄 TROUBLESHOOTING.md
   → Problem solving guide

📄 QUICK_REFERENCE.md
   → This file
```

---

## 🎯 Usage Scenarios

### Scenario 1: User Wants to Message Another User
```
1. Click mail icon in navbar
2. Go to /inbox
3. See list of conversations
4. Click "+" button
5. Enter other user's ID (e.g., "2")
6. Click "Start Chat"
7. Chat opens on the right
8. Type message and press Send
9. Message appears instantly
10. Other user sees it in real-time
```

### Scenario 2: User Needs Help
```
1. Click mail icon → /support link
2. See list of support tickets
3. Click "+" button
4. Fill form:
   - Subject: "Can't change booking date"
   - Description: "Booked for March, need April"
   - Category: "booking"
5. Click "Create Ticket"
6. Ticket appears in list
7. Click ticket to open
8. Type message to support team
9. Support team responds in real-time
10. Status updates: open → in_progress → resolved
```

---

## 💡 Tips & Tricks

### Debugging
```javascript
// Check Socket.io connection
console.log(socket.connected);  // true or false

// Check user token
console.log(localStorage.getItem("authToken"));

// See all socket events
socket.onAny((event, ...args) => {
  console.log(`Event: ${event}`, args);
});
```

### Performance
- Messages load only when needed
- Only 50 messages at a time (pagination)
- Database indexes on user_id
- Connection pooling enabled

### Security
- All endpoints protected with JWT
- Can't see other user's conversations
- Support tickets belong to specific user
- Admin-only endpoints separate

---

## 🚀 Deploy Checklist

- [ ] Database created with all tables
- [ ] `.env` file has correct credentials
- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Socket.io connected successfully
- [ ] Can create conversation
- [ ] Can send/receive messages
- [ ] Can create support ticket
- [ ] Can search conversations
- [ ] Unread badges update
- [ ] No console errors
- [ ] Responsive on mobile

---

## 📞 Quick Help

**Backend won't start?**
→ Check port 5000 not in use, run `npm install socket.io`

**Messages not sending?**
→ Check Socket.io connection, verify auth token

**Database error?**
→ Run the SQL schema, check MySQL credentials

**Can't find files?**
→ Check file paths in `backend/` and `frontend/src/`

**CORS error?**
→ Add your domain to CORS config in socket.js

---

## ✅ Final Checklist

- [x] Backend implemented and tested
- [x] Frontend components created
- [x] Database schema ready
- [x] Routes configured
- [x] Socket.io integrated
- [x] Authentication added
- [x] Documentation complete
- [x] Examples provided
- [x] Troubleshooting guide included

**Ready to go! 🚀**

---

**Last Updated:** 2024
**Status:** ✅ COMPLETE
**Version:** 1.0
