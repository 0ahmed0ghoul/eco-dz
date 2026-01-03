import { Router } from "express";
import {getOrCreateConversation,getUserConversations,getConversationMessages} from "../controllers/messaging.controller.js";
import { auth } from "../middleware/auth.middleware.js";

const router = Router();

// All routes require authentication
router.use(auth);

// === DIRECT MESSAGING ===

// Get or create conversation
router.post("/conversations",auth, getOrCreateConversation);

// Get user's conversations (inbox)
router.get("/conversations",auth, getUserConversations);

// Get messages in a conversation
router.get("/conversations/:conversationId/messages",auth, getConversationMessages);


export default router;
