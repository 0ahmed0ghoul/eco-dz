import { Router } from "express";
import {getOrCreateConversation,getUserConversations,getConversationMessages, getUnreadCount, markConversationAsRead} from "../controllers/messaging.controller.js";
import { auth } from "../middleware/auth.middleware.js";

const router = Router();

// All routes require authentication
router.use(auth);

// === DIRECT MESSAGING ===

// Get or create conversation
router.post("/conversations",auth, getOrCreateConversation);

// Get user's conversations (inbox)
router.get("/conversations",auth, getUserConversations);
router.get("/unread-count",auth, getUnreadCount);

// Get messages in a conversation
router.get("/conversations/:conversationId/messages",auth, getConversationMessages);

// Add this route AFTER your other conversation routes
router.post("/conversations/:conversationId/mark-read", auth, markConversationAsRead);

export default router;
