# Troubleshooting Guide - Real-Time Messaging System

## Issue: Socket.io Not Connecting

### Symptoms
- Console error: "Connection failed"
- Chat not showing messages
- "Socket not connected" warning

### Solutions

**1. Check Backend is Running**
```bash
# Terminal: Is backend running on port 5000?
cd backend
npm start
# Should see: "Server running on port 5000"
```

**2. Verify Socket.io Port**
```javascript
// In Chat.jsx or SupportChat.jsx
// Make sure URL is correct:
const socket = io("http://localhost:5000", {
  auth: { token: localStorage.getItem("authToken") }
});
```

**3. Check Auth Token**
```javascript
// In browser console:
console.log(localStorage.getItem("authToken"));
// Should return a token string, not null
```

**4. Clear Browser Cache**
- Press `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
- Clear cache and cookies
- Refresh page

**5. Check CORS Settings**
```javascript
// In backend/socket/socket.js
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:5173",  // ← Verify this is correct
    methods: ["GET", "POST"]
  }
});
```

**6. Verify Port 5173 for Frontend**
```bash
# Terminal: Is frontend running on 5173?
cd frontend
npm run dev
# Should show: "http://localhost:5173"
```

---

## Issue: Messages Not Appearing

### Symptoms
- Message sends but doesn't appear
- Other user doesn't receive message
- "Message sent" but no display

### Solutions

**1. Check WebSocket Connection**
```javascript
// In browser console:
socket.connected  // Should be true
socket.id         // Should show Socket ID
```

**2. Verify Conversation ID is Correct**
```javascript
// In Chat.jsx component props:
console.log("Conversation ID:", conversationId);
// Should be a number, not null or undefined
```

**3. Check Message is Saving to Database**
```bash
# In MySQL:
SELECT * FROM messages ORDER BY created_at DESC LIMIT 5;
# Should show your recent messages

SELECT * FROM conversations;
# Should show your conversation
```

**4. Check Socket.io Event Listeners**
```javascript
// Add logging in Chat.jsx
socket.on("message-received", (message) => {
  console.log("Received:", message);  // Add this
  setMessages(prev => [...prev, message]);
});
```

**5. Verify Auth Token is Valid**
```bash
# Backend console should show: "User authenticated: userId"
# If not, token might be expired or invalid
```

**6. Check Other User is Connected**
```javascript
// Both users need to be in same room
// Verify both joined the conversation:
socket.emit("join-conversation", conversationId);
```

---

## Issue: "Connection refused" Error

### Symptoms
- "Error: Connection refused"
- "ECONNREFUSED localhost:5000"
- Can't connect to backend

### Solutions

**1. Backend Not Running**
```bash
cd backend
npm start
# Wait for "Server running on port 5000" message
```

**2. Wrong Port Number**
```javascript
// Check frontend has correct backend URL:
const socket = io("http://localhost:5000");  // ← NOT 5173

// Check backend .env:
PORT=5000  // ← Correct
```

**3. Firewall Blocking Port**
```bash
# Windows: Check firewall allows port 5000
# Mac: System Preferences > Security & Privacy
```

**4. Port Already in Use**
```bash
# Find what's using port 5000:
# Windows:
netstat -ano | findstr :5000

# Mac/Linux:
lsof -i :5000

# Kill the process and restart
```

---

## Issue: "401 Unauthorized" Error

### Symptoms
- API returns 401
- "Invalid token" error
- Can't fetch conversations

### Solutions

**1. Token Missing**
```javascript
// In API requests, check Authorization header:
const token = localStorage.getItem("authToken");
if (!token) {
  console.error("No token found, please login");
}
```

**2. Token Expired**
```javascript
// Tokens expire. User needs to login again
localStorage.removeItem("authToken");
// Redirect to login page
```

**3. Token in Wrong Format**
```javascript
// Correct format:
headers: {
  "Authorization": "Bearer your_token_here"
}

// NOT:
headers: {
  "Authorization": "your_token_here"  // ← Wrong
}
```

**4. Verify auth.middleware.js**
```javascript
// In backend/middleware/auth.middleware.js
// Should extract token and verify it
export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: "No token" });
  // ... verify token
};
```

---

## Issue: Database Connection Error

### Symptoms
- "Cannot connect to database"
- Database queries fail
- 500 Internal Server Error

### Solutions

**1. Check MySQL Running**
```bash
# Windows:
mysql -u root -p

# Mac:
mysql -u root -p
# Enter password

# Should connect successfully
```

**2. Verify Database Credentials**
```javascript
// In backend/.env:
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=your_password  // ← Check this
DATABASE_NAME=eco_dz
```

**3. Check Tables Exist**
```sql
USE eco_dz;
SHOW TABLES;
-- Should show: conversations, messages, support_tickets, support_messages
```

**4. Verify Connection in db.js**
```javascript
// In backend/db.js
const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
```

**5. Test Connection**
```bash
cd backend
node -e "const db = require('./db.js'); console.log('Connected!');"
```

---

## Issue: Conversation Not Found

### Symptoms
- "Conversation not found" error
- Can't load chat
- 404 response

### Solutions

**1. Verify Conversation ID**
```bash
# In MySQL:
SELECT id, user1_id, user2_id FROM conversations;
# Make sure the ID exists
```

**2. Check User Has Access**
```javascript
// User can only see conversations they're part of
// Verify user1_id or user2_id matches logged-in user
SELECT * FROM conversations 
WHERE (user1_id = 1 AND user2_id = 2) 
   OR (user1_id = 2 AND user2_id = 1);
```

**3. Verify Controller Logic**
```javascript
// In messaging.controller.js
export const getConversationMessages = async (req, res) => {
  const { conversationId } = req.params;
  const userId = req.user.id;  // ← Verify this is set
  // ... check user has access
};
```

---

## Issue: Support Tickets Not Loading

### Symptoms
- Support Chat page blank
- Tickets list empty when it shouldn't be
- 500 error on `/support`

### Solutions

**1. Check Tickets Table**
```sql
SELECT * FROM support_tickets;
-- Should show your tickets

SELECT * FROM support_messages;
-- Should show ticket messages
```

**2. Verify API Endpoint**
```bash
# In browser, test API:
curl http://localhost:5000/api/messaging/support/tickets \
  -H "Authorization: Bearer your_token"
# Should return JSON array of tickets
```

**3. Check Controller Function**
```javascript
// In messaging.controller.js
export const getSupportTickets = async (req, res) => {
  const userId = req.user.id;  // ← Verify user is set
  // ... fetch tickets for this user only
};
```

**4. Verify User ID in Database**
```sql
SELECT * FROM support_tickets WHERE user_id = 1;
-- Replace 1 with your user ID
```

---

## Issue: Real-Time Updates Not Working

### Symptoms
- Messages appear only after refresh
- Other user doesn't see my message
- "No real-time updates"

### Solutions

**1. Verify Socket.io Rooms**
```javascript
// In Chat.jsx, verify room is joined:
socket.on("connect", () => {
  socket.emit("join-conversation", conversationId);
  console.log("Joined conversation:", conversationId);
});
```

**2. Check Socket.io Broadcast**
```javascript
// In backend/socket/socket.js
socket.on("send-message", async (data) => {
  // ... save to database
  io.to(`conversation-${data.conversationId}`).emit("message-received", message);
  console.log("Broadcasted to conversation:", data.conversationId);
});
```

**3. Both Users Must Join Room**
```javascript
// Both user A and user B must call:
socket.emit("join-conversation", 1);  // conversation ID
// Then they'll both receive real-time updates
```

**4. Check Socket Event Names Match**
```javascript
// Must match exactly:
socket.emit("send-message", data);           // Frontend
socket.on("send-message", (data) => {...});  // Backend

socket.emit("message-received", message);    // Backend
socket.on("message-received", (msg) => {...}); // Frontend
```

---

## Issue: "Cannot read property 'map' of undefined"

### Symptoms
- Component crashes
- Error in console about map() on undefined
- Messages array is undefined

### Solutions

**1. Initialize State with Empty Array**
```javascript
// In Chat.jsx:
const [messages, setMessages] = useState([]);  // ← Must be array, not null
```

**2. Check API Response**
```javascript
// After fetching messages:
console.log("Messages from API:", messages);
// Should be array: [{...}, {...}]
// Not: undefined or null
```

**3. Verify Response Structure**
```javascript
// API should return:
{
  messages: [
    { id: 1, message_text: "Hello", ... },
    { id: 2, message_text: "Hi", ... }
  ]
}

// Not:
{
  message: "Hello"
}
```

**4. Add Safety Check**
```javascript
// In render:
{messages?.map((msg) => (
  // ↑ Use optional chaining
))}
```

---

## Issue: CORS Error in Console

### Symptoms
- "Access to XMLHttpRequest blocked by CORS"
- Socket.io connection refused
- "No 'Access-Control-Allow-Origin' header"

### Solutions

**1. Check CORS in Backend**
```javascript
// In app.js or socket.js:
const cors = require("cors");
app.use(cors({
  origin: "http://localhost:5173",  // ← Add frontend URL
  methods: ["GET", "POST"],
  credentials: true
}));
```

**2. Verify Frontend Port**
```javascript
// Frontend URL must match CORS:
// If frontend is on http://localhost:3000
// Then add that to CORS, not http://localhost:5173

app.use(cors({
  origin: "http://localhost:3000"  // ← Update this
}));
```

**3. Socket.io CORS Config**
```javascript
// In socket/socket.js:
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});
```

---

## Issue: Old Messages Not Loading

### Symptoms
- New messages appear but old ones don't
- Message history empty on first load
- Only see messages after sending one

### Solutions

**1. Check Message Fetch on Load**
```javascript
// In Chat.jsx, add useEffect:
useEffect(() => {
  if (conversationId) {
    fetchMessages();  // ← Must fetch on component load
  }
}, [conversationId]);
```

**2. Verify Database has Messages**
```sql
SELECT * FROM messages WHERE conversation_id = 1;
-- Should show messages from this conversation
```

**3. Check API Response**
```javascript
// Fetch should return all messages:
GET /api/messaging/conversations/:id/messages
// Response:
{
  messages: [
    { id: 1, message_text: "..." },
    { id: 2, message_text: "..." },
    // ... all messages
  ]
}
```

**4. Order Messages by Date**
```javascript
// In Chat.jsx, sort messages:
const sortedMessages = messages.sort((a, b) =>
  new Date(a.created_at) - new Date(b.created_at)
);
```

---

## Issue: Typing Indicator Not Working

### Symptoms
- Typing status not shown
- No "is typing..." message
- Indicator appears for all users

### Solutions

**1. Emit Typing Event**
```javascript
// In Chat.jsx, on input change:
const handleInputChange = (e) => {
  setNewMessage(e.target.value);
  socket.emit("typing", {
    conversationId: conversationId,
    isTyping: true
  });
};
```

**2. Stop Typing Event**
```javascript
// After sending or waiting:
socket.emit("typing", {
  conversationId: conversationId,
  isTyping: false
});
```

**3. Listen for Typing**
```javascript
socket.on("typing", (data) => {
  if (data.isTyping) {
    setIsTyping(true);
  } else {
    setIsTyping(false);
  }
});
```

---

## Quick Diagnostic Checklist

Copy this and run through each item:

```
☐ Backend running: npm start in backend/ folder
☐ Frontend running: npm run dev in frontend/ folder
☐ Backend on port 5000: http://localhost:5000
☐ Frontend on port 5173: http://localhost:5173
☐ MySQL database running and connected
☐ Database tables created (conversations, messages, etc.)
☐ Auth token in localStorage: console.log(localStorage.getItem("authToken"))
☐ Socket.io connection: console.log(socket.connected)
☐ Conversation ID is valid: SELECT * FROM conversations
☐ Messages table has data: SELECT * FROM messages
☐ No CORS errors in console
☐ No 401 unauthorized errors
☐ No database connection errors
☐ Socket.io client library installed: npm list socket.io-client
☐ Socket.io server library installed: npm list socket.io
```

---

## Debug Mode

Enable detailed logging:

```javascript
// In Chat.jsx component:
console.log("=== CHAT COMPONENT DEBUG ===");
console.log("Conversation ID:", conversationId);
console.log("Messages:", messages);
console.log("Socket connected:", socket.connected);
console.log("Socket ID:", socket.id);

// Listen to all socket events:
socket.onAny((event, ...args) => {
  console.log(`[Socket Event] ${event}:`, args);
});
```

```javascript
// In backend socket/socket.js
socket.on("send-message", (data) => {
  console.log("[Backend] Message received:", data);
  console.log("[Backend] Saving to DB...");
  // ... save and broadcast
  console.log("[Backend] Broadcasting to room:", `conversation-${data.conversationId}`);
});
```

---

## Getting Help

If you're still stuck:

1. **Check documentation files:**
   - `SETUP_MESSAGING.md` - Setup instructions
   - `MESSAGING_SYSTEM.md` - Architecture & details
   - `API_EXAMPLES.md` - Request examples

2. **Check error logs:**
   - Browser console: F12 → Console tab
   - Backend terminal: Look for error messages
   - MySQL: Check logs or try query directly

3. **Test API directly:**
   - Use Postman or curl
   - Test `/api/messaging/conversations`
   - Verify you get valid response

4. **Verify implementation:**
   - Use `IMPLEMENTATION_CHECKLIST.md`
   - Check all files were created
   - Verify routes are registered

---

## Common Fixes Summary

| Problem | Quick Fix |
|---------|-----------|
| Not connecting | Check backend port 5000 |
| Messages not saving | Check database tables exist |
| 401 errors | Verify token in localStorage |
| Real-time not working | Check Socket.io connection |
| CORS error | Add frontend URL to cors config |
| Old messages missing | Verify fetchMessages() called |
| Component crash | Check state initialized as array |
| Typing not working | Emit typing events in handleInputChange |

---

**Still need help? Review the 5 documentation files provided with the system.**
