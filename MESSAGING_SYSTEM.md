# Real-Time Messaging System Documentation

## Overview
A complete real-time messaging and support system built with Socket.io for direct user-to-user messaging and support ticket management.

## Features

### 1. **Direct User Messaging**
- One-on-one private conversations between users
- Message history persistence
- Unread message count tracking
- Search conversations by username
- Create new conversations with other users
- Real-time message delivery with Socket.io

### 2. **Support Chat System**
- Create support tickets for help with bookings and destinations
- Real-time communication with support team
- Ticket categorization (general, booking, destination, complaint)
- Ticket status tracking (open, in_progress, resolved, closed)
- Admin support team responses
- Message persistence and history

## Architecture

### Backend Components

#### Database Schema
Located in `backend/schema/messaging.sql`:

```sql
-- Conversations table for direct messaging
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

#### Socket.io Configuration
File: `backend/socket/socket.js`

**Events Handled:**
- `user-online` - Track when users come online
- `user-offline` - Track when users go offline
- `join-conversation` - User joins a conversation room
- `send-message` - Send a direct message
- `message-received` - Receive a message in real-time
- `typing` - Typing indicator
- `send-support-message` - Send message to support ticket
- `support-message-received` - Receive support response
- `mark-as-read` - Mark messages as read

**Key Features:**
```javascript
// User online tracking
const userSockets = new Map(); // Maps userId to socketId

// Conversation room management
socket.on("join-conversation", (conversationId) => {
  socket.join(`conversation-${conversationId}`);
});

// Real-time message emission
socket.on("send-message", async (data) => {
  // Save to database
  // Emit to other user in conversation
  io.to(`conversation-${data.conversationId}`).emit("message-received", messageData);
});

// Support ticket messaging
socket.on("send-support-message", async (data) => {
  // Save to database
  // Notify admin and user
  io.to(`support-${data.ticketId}`).emit("support-message-received", messageData);
});
```

#### Controllers
File: `backend/controllers/messaging.controller.js`

**Exported Functions:**

1. **`getOrCreateConversation(req, res)`**
   - Get existing conversation or create new one
   - POST `/api/messaging/conversations`
   - Body: `{ otherUserId: number }`

2. **`getUserConversations(req, res)`**
   - Get all conversations for logged-in user
   - GET `/api/messaging/conversations`
   - Returns: Array of conversations with unread count

3. **`getConversationMessages(req, res)`**
   - Get message history for a conversation
   - GET `/api/messaging/conversations/:conversationId/messages`

4. **`getSupportTickets(req, res)`**
   - Get all support tickets for user
   - GET `/api/messaging/support/tickets`

5. **`createSupportTicket(req, res)`**
   - Create new support ticket
   - POST `/api/messaging/support/tickets`
   - Body: `{ subject, description, category }`

6. **`getSupportTicketDetails(req, res)`**
   - Get ticket with all messages
   - GET `/api/messaging/support/tickets/:ticketId`

7. **`getAllSupportTickets(req, res)` (Admin)**
   - Get all support tickets system-wide
   - GET `/api/messaging/support/tickets/admin/all`

8. **`respondToTicket(req, res)` (Admin)**
   - Admin response to support ticket
   - POST `/api/messaging/support/tickets/:ticketId/respond`

#### Routes
File: `backend/routes/messaging.routes.js`

```javascript
// Direct Messaging Routes
POST /api/messaging/conversations              // Create/get conversation
GET  /api/messaging/conversations              // Get user's conversations
GET  /api/messaging/conversations/:id/messages // Get message history

// Support Ticket Routes
POST /api/messaging/support/tickets            // Create ticket
GET  /api/messaging/support/tickets            // Get user's tickets
GET  /api/messaging/support/tickets/:id        // Get ticket details
POST /api/messaging/support/tickets/:id/respond // Admin response

// Admin Routes
GET  /api/messaging/support/tickets/admin/all  // All system tickets
```

### Frontend Components

#### 1. **Inbox Component** (`src/components/Inbox.jsx`)
- Left sidebar with conversation list
- Search functionality for finding conversations
- Unread message count badges
- New conversation creation dialog
- Chat component integrated on the right side

**Features:**
```javascript
// Conversation list with real-time updates
const [conversations, setConversations] = useState([]);

// Search conversations
const filteredConversations = conversations.filter(conv =>
  conv.other_user_name?.toLowerCase().includes(searchTerm.toLowerCase())
);

// Create new chat
handleStartNewChat() // Calls POST /api/messaging/conversations

// Display Chat component when selected
<Chat 
  conversationId={selectedConversation}
  otherUserName={selectedUserName}
  otherUserId={selectedUserId}
/>
```

#### 2. **Chat Component** (`src/components/Chat.jsx`)
- Real-time message display
- Message input form
- Typing indicators
- Auto-scroll to latest messages
- User online status
- Message history loading

**Socket.io Integration:**
```javascript
// Initialize Socket.io connection
const socketRef = useRef(null);
socketRef.current = io("http://localhost:5000", {
  auth: { token: localStorage.getItem("authToken") }
});

// Send message via Socket.io
socketRef.current.emit("send-message", {
  conversationId: conversationId,
  senderId: user.id,
  message: newMessage
});

// Receive messages in real-time
socketRef.current.on("message-received", (message) => {
  setMessages(prev => [...prev, message]);
});

// Typing indicator
socketRef.current.emit("typing", {
  conversationId: conversationId,
  isTyping: true
});
```

#### 3. **SupportChat Component** (`src/components/SupportChat.jsx`)
- Support ticket list in sidebar
- Create new support tickets
- Real-time support chat
- Ticket status badges
- Ticket categories

**Features:**
```javascript
// Create ticket
POST /api/messaging/support/tickets
Body: {
  subject: string,
  description: string,
  category: 'general' | 'booking' | 'destination' | 'complaint'
}

// Join ticket room
socket.emit("join-support", ticketId)

// Send support message
socket.emit("send-support-message", {
  ticketId: number,
  senderId: number,
  message: string,
  isAdmin: false
})

// Receive support response
socket.on("support-message-received", (message) => {
  // Display admin response
})
```

## Integration

### Routing
Routes are registered in `frontend/src/App.jsx`:
```javascript
<Route path="/inbox" element={<Inbox />} />
<Route path="/support" element={<SupportChat />} />
```

### Navigation
Navbar links (update in `src/components/Navbar.jsx`):
- Mail icon with unread count badge
- Click to navigate to `/inbox`

## Environment Setup

### Backend Requirements
```bash
npm install socket.io
npm install cors
```

### Frontend Requirements
```bash
npm install socket.io-client
```

### Environment Variables
**.env file:**
```
PORT=5000
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=password
DATABASE_NAME=eco_dz
JWT_SECRET=your-secret-key
NODE_ENV=development
```

## Authentication

All messaging endpoints are protected with JWT authentication:

**Middleware: `backend/middleware/auth.middleware.js`**
```javascript
// Applied to all messaging routes
export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  // Verify JWT token
  // Attach user to req
};
```

**Socket.io Authentication:**
```javascript
socket.on("connection", (socket) => {
  const token = socket.handshake.auth.token;
  // Verify token
  const userId = verifyToken(token);
});
```

## Testing

### Manual Testing Steps

1. **Direct Messaging:**
   ```bash
   # Open two browser windows with different users
   # User 1: Navigate to /inbox
   # Create new conversation with User 2 (by ID)
   # Send message - should appear in real-time
   # Check message history on refresh
   ```

2. **Support Tickets:**
   ```bash
   # Navigate to /support
   # Create new ticket
   # Send message to support team
   # Check real-time updates
   # Admin can respond via database update
   ```

3. **Socket.io Connection:**
   ```bash
   # Open browser DevTools
   # Network tab -> WS tab
   # Should show Socket.io connection to localhost:5000
   ```

## Performance Considerations

1. **Message Pagination**
   - Load messages in batches of 50
   - Implement infinite scroll or "Load More"
   - Prevents loading entire conversation history

2. **Connection Management**
   - Auto-reconnect on disconnect
   - Queue messages while offline
   - Sync on reconnection

3. **Database Optimization**
   - Index on conversation_id, user_id, created_at
   - Archive old messages
   - Cleanup closed support tickets

## Future Enhancements

1. **Message Features**
   - File/image sharing
   - Message reactions/emojis
   - Message deletion
   - Message editing
   - Read receipts

2. **Support Features**
   - Ticket assignment to specific agents
   - Priority/SLA management
   - Ticket escalation
   - Automated responses/canned replies
   - Knowledge base integration

3. **Admin Dashboard**
   - Support ticket analytics
   - Response time metrics
   - User messaging statistics
   - Chat history search/export

4. **User Notifications**
   - Browser notifications for new messages
   - Email notifications for support responses
   - Notification preferences
   - Do not disturb mode

5. **Advanced Chat**
   - Group chats
   - Video/audio call integration
   - Screen sharing
   - Message encryption

## Troubleshooting

### Socket.io Not Connecting
```javascript
// Check CORS settings in backend
// Ensure port 5000 is running
// Check auth token is valid
console.log("Socket connection status:", socket.connected);
```

### Messages Not Saving
```javascript
// Check database connection
// Verify user IDs exist in database
// Check foreign key constraints
// Monitor error logs
```

### Message Delivery Delay
```javascript
// Check Socket.io rooms are joined correctly
// Verify bandwidth/connection speed
// Monitor database query performance
// Scale Socket.io with multiple servers if needed
```

## File Structure
```
backend/
├── socket/
│   └── socket.js              # Socket.io event handlers
├── controllers/
│   └── messaging.controller.js # Conversation/ticket logic
├── routes/
│   └── messaging.routes.js     # API endpoints
├── schema/
│   └── messaging.sql           # Database tables
└── app.js                      # Updated to use httpServer

frontend/
└── src/
    ├── components/
    │   ├── Inbox.jsx           # Conversation list UI
    │   ├── Chat.jsx            # Real-time chat display
    │   └── SupportChat.jsx      # Support ticket UI
    └── App.jsx                 # Routes configured
```

## Summary

The messaging system provides:
- ✅ Real-time direct user-to-user messaging
- ✅ Support ticket system for customer help
- ✅ Message history persistence
- ✅ Online/offline status tracking
- ✅ Typing indicators
- ✅ Unread count badges
- ✅ Full authentication integration
- ✅ Responsive UI with Tailwind CSS
- ✅ Socket.io for real-time communication
- ✅ Database schema for messages and tickets
