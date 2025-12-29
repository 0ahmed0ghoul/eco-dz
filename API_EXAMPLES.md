# Messaging API - Example Requests

## Setup

All requests require JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

Base URL: `http://localhost:5000`

---

## Direct Messaging API

### 1. Create or Get Conversation
**Endpoint:** `POST /api/messaging/conversations`

**Request:**
```bash
curl -X POST http://localhost:5000/api/messaging/conversations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_token_here" \
  -d '{
    "otherUserId": 2
  }'
```

**Response:**
```json
{
  "id": 1,
  "user1_id": 1,
  "user2_id": 2,
  "other_user_name": "John Doe",
  "other_user_id": 2,
  "last_message_at": null,
  "last_message": null,
  "unread_count": 0
}
```

---

### 2. Get All User Conversations
**Endpoint:** `GET /api/messaging/conversations`

**Request:**
```bash
curl -X GET http://localhost:5000/api/messaging/conversations \
  -H "Authorization: Bearer your_token_here"
```

**Response:**
```json
[
  {
    "id": 1,
    "user1_id": 1,
    "user2_id": 2,
    "other_user_name": "John Doe",
    "other_user_id": 2,
    "last_message": "Hey, how are you?",
    "last_message_at": "2024-01-15T10:30:00Z",
    "unread_count": 2
  },
  {
    "id": 2,
    "user1_id": 1,
    "user2_id": 3,
    "other_user_name": "Jane Smith",
    "other_user_id": 3,
    "last_message": "See you tomorrow",
    "last_message_at": "2024-01-14T15:45:00Z",
    "unread_count": 0
  }
]
```

---

### 3. Get Conversation Message History
**Endpoint:** `GET /api/messaging/conversations/:conversationId/messages`

**Request:**
```bash
curl -X GET http://localhost:5000/api/messaging/conversations/1/messages \
  -H "Authorization: Bearer your_token_here"
```

**Response:**
```json
{
  "conversationId": 1,
  "otherUserName": "John Doe",
  "messages": [
    {
      "id": 1,
      "conversation_id": 1,
      "sender_id": 1,
      "message_text": "Hi John",
      "created_at": "2024-01-15T10:00:00Z"
    },
    {
      "id": 2,
      "conversation_id": 1,
      "sender_id": 2,
      "message_text": "Hey, how are you?",
      "created_at": "2024-01-15T10:05:00Z"
    }
  ]
}
```

---

## Support Tickets API

### 1. Create Support Ticket
**Endpoint:** `POST /api/messaging/support/tickets`

**Request:**
```bash
curl -X POST http://localhost:5000/api/messaging/support/tickets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_token_here" \
  -d '{
    "subject": "Problem with my booking",
    "description": "I booked a tour for tomorrow but didnt receive confirmation",
    "category": "booking"
  }'
```

**Response:**
```json
{
  "id": 5,
  "user_id": 1,
  "subject": "Problem with my booking",
  "description": "I booked a tour for tomorrow but didnt receive confirmation",
  "category": "booking",
  "status": "open",
  "priority": null,
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

### 2. Get User Support Tickets
**Endpoint:** `GET /api/messaging/support/tickets`

**Request:**
```bash
curl -X GET http://localhost:5000/api/messaging/support/tickets \
  -H "Authorization: Bearer your_token_here"
```

**Response:**
```json
[
  {
    "id": 5,
    "user_id": 1,
    "subject": "Problem with my booking",
    "description": "I booked a tour for tomorrow but didnt receive confirmation",
    "category": "booking",
    "status": "open",
    "priority": null,
    "created_at": "2024-01-15T10:30:00Z"
  },
  {
    "id": 3,
    "user_id": 1,
    "subject": "Sahara tour question",
    "description": "Is there a minimum group size?",
    "category": "destination",
    "status": "resolved",
    "priority": "normal",
    "created_at": "2024-01-10T14:20:00Z"
  }
]
```

---

### 3. Get Support Ticket Details (with messages)
**Endpoint:** `GET /api/messaging/support/tickets/:ticketId`

**Request:**
```bash
curl -X GET http://localhost:5000/api/messaging/support/tickets/5 \
  -H "Authorization: Bearer your_token_here"
```

**Response:**
```json
{
  "id": 5,
  "user_id": 1,
  "subject": "Problem with my booking",
  "description": "I booked a tour for tomorrow but didnt receive confirmation",
  "category": "booking",
  "status": "open",
  "priority": null,
  "created_at": "2024-01-15T10:30:00Z",
  "messages": [
    {
      "id": 1,
      "ticket_id": 5,
      "sender_id": 1,
      "message_text": "I didnt receive my booking confirmation",
      "is_admin": false,
      "created_at": "2024-01-15T10:35:00Z"
    },
    {
      "id": 2,
      "ticket_id": 5,
      "sender_id": 10,
      "message_text": "Let me check that for you. What is your booking reference?",
      "is_admin": true,
      "created_at": "2024-01-15T11:00:00Z"
    }
  ]
}
```

---

### 4. Get All Support Tickets (Admin Only)
**Endpoint:** `GET /api/messaging/support/tickets/admin/all`

**Request:**
```bash
curl -X GET http://localhost:5000/api/messaging/support/tickets/admin/all \
  -H "Authorization: Bearer admin_token_here"
```

**Response:**
```json
[
  {
    "id": 5,
    "user_id": 1,
    "subject": "Problem with my booking",
    "category": "booking",
    "status": "open",
    "created_at": "2024-01-15T10:30:00Z"
  },
  {
    "id": 4,
    "user_id": 3,
    "subject": "I need help changing dates",
    "category": "booking",
    "status": "in_progress",
    "created_at": "2024-01-15T08:00:00Z"
  }
]
```

---

### 5. Admin Respond to Support Ticket
**Endpoint:** `POST /api/messaging/support/tickets/:ticketId/respond`

**Request:**
```bash
curl -X POST http://localhost:5000/api/messaging/support/tickets/5/respond \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer admin_token_here" \
  -d '{
    "message_text": "I found your booking! The confirmation was sent to your email. Please check spam folder.",
    "newStatus": "resolved"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Response added to ticket",
  "ticket": {
    "id": 5,
    "status": "resolved"
  }
}
```

---

## Socket.io Events

### Connection Setup
```javascript
import io from "socket.io-client";

const token = localStorage.getItem("authToken");
const socket = io("http://localhost:5000", {
  auth: { token }
});

socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("connect_error", (error) => {
  console.error("Connection error:", error);
});
```

---

### Direct Messaging Events

#### Send Message
```javascript
socket.emit("send-message", {
  conversationId: 1,
  senderId: 1,
  message: "Hello, how are you?",
  timestamp: new Date()
});
```

#### Receive Message
```javascript
socket.on("message-received", (messageData) => {
  console.log("New message:", messageData);
  // messageData = {
  //   id: 3,
  //   conversation_id: 1,
  //   sender_id: 2,
  //   message_text: "I'm doing great!",
  //   created_at: "2024-01-15T10:45:00Z"
  // }
});
```

#### Join Conversation
```javascript
socket.emit("join-conversation", conversationId);
// Now you'll receive real-time updates for this conversation
```

#### Typing Indicator
```javascript
// User is typing
socket.emit("typing", {
  conversationId: 1,
  isTyping: true
});

// Received typing indicator
socket.on("typing", (data) => {
  console.log(`${data.senderName} is typing...`);
});
```

#### Mark as Read
```javascript
socket.emit("mark-as-read", {
  conversationId: 1,
  messageId: 3
});
```

#### User Online Status
```javascript
socket.emit("user-online", {
  userId: 1
});

socket.on("user-online", (data) => {
  console.log(`${data.username} is now online`);
});

socket.on("user-offline", (data) => {
  console.log(`${data.username} is offline`);
});
```

---

### Support Ticket Events

#### Send Support Message
```javascript
socket.emit("send-support-message", {
  ticketId: 5,
  senderId: 1,
  message: "I still haven't received my confirmation",
  isAdmin: false
});
```

#### Receive Support Message
```javascript
socket.on("support-message-received", (messageData) => {
  console.log("Support response:", messageData);
  // messageData = {
  //   id: 3,
  //   ticket_id: 5,
  //   sender_id: 10,
  //   message_text: "Our team is looking into this...",
  //   is_admin: true,
  //   created_at: "2024-01-15T11:30:00Z"
  // }
});
```

#### Join Support Ticket
```javascript
socket.emit("join-support", ticketId);
// Now you'll receive real-time updates for this support ticket
```

---

## Postman Collection Example

### Create and Save Requests in Postman

1. **POST - Create Conversation**
   - URL: `{{base_url}}/api/messaging/conversations`
   - Method: POST
   - Headers: `Authorization: Bearer {{token}}`
   - Body: `{ "otherUserId": 2 }`

2. **GET - Get Conversations**
   - URL: `{{base_url}}/api/messaging/conversations`
   - Method: GET
   - Headers: `Authorization: Bearer {{token}}`

3. **GET - Get Messages**
   - URL: `{{base_url}}/api/messaging/conversations/1/messages`
   - Method: GET
   - Headers: `Authorization: Bearer {{token}}`

4. **POST - Create Support Ticket**
   - URL: `{{base_url}}/api/messaging/support/tickets`
   - Method: POST
   - Headers: `Authorization: Bearer {{token}}`
   - Body:
   ```json
   {
     "subject": "My question",
     "description": "Details here",
     "category": "general"
   }
   ```

5. **GET - Get Support Tickets**
   - URL: `{{base_url}}/api/messaging/support/tickets`
   - Method: GET
   - Headers: `Authorization: Bearer {{token}}`

### Postman Variables
```
base_url: http://localhost:5000
token: [your_jwt_token]
conversationId: 1
ticketId: 5
```

---

## cURL Examples by Use Case

### Start a New Conversation
```bash
curl -X POST http://localhost:5000/api/messaging/conversations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR..." \
  -d '{"otherUserId": 2}'
```

### Fetch All Messages with User
```bash
curl -X GET http://localhost:5000/api/messaging/conversations/1/messages \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR..."
```

### Submit Support Ticket
```bash
curl -X POST http://localhost:5000/api/messaging/support/tickets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR..." \
  -d '{
    "subject": "Cant change my booking",
    "description": "Booked for March but need April",
    "category": "booking"
  }'
```

### Admin: Get All Tickets
```bash
curl -X GET http://localhost:5000/api/messaging/support/tickets/admin/all \
  -H "Authorization: Bearer admin_token_here"
```

---

## Response Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized (invalid token) |
| 403 | Forbidden (not your conversation) |
| 404 | Not Found |
| 500 | Server Error |

---

## Error Response Examples

### Missing Authorization Header
```json
{
  "error": "No token provided"
}
```

### Invalid User ID
```json
{
  "error": "Cannot start conversation with yourself"
}
```

### Conversation Not Found
```json
{
  "error": "Conversation not found"
}
```

### Support Ticket Not Found
```json
{
  "error": "Support ticket not found"
}
```

---

## Testing Workflow

1. **Get auth token** (from your login endpoint)
2. **Create conversation** with another user
3. **Send message** via Socket.io
4. **Fetch messages** from HTTP endpoint
5. **Create support ticket** with issue
6. **Send support message** via Socket.io
7. **Admin responds** to ticket
8. **Verify** messages appear in real-time

---

## Debugging Tips

### Check Socket.io Connection
```javascript
console.log("Socket connected:", socket.connected);
console.log("Socket ID:", socket.id);
console.log("Socket rooms:", socket.rooms);
```

### Log All Events
```javascript
socket.onAny((event, ...args) => {
  console.log(`Socket event: ${event}`, args);
});
```

### Check Message in Console
```javascript
socket.on("message-received", (data) => {
  console.log("Message received:", JSON.stringify(data, null, 2));
});
```

### Verify Token
```javascript
const token = localStorage.getItem("authToken");
console.log("Token:", token);
// Decode and check expiration
```
