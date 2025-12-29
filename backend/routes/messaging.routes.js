import { Router } from "express";
import * as controller from "../controllers/messaging.controller.js";
import { auth } from "../middleware/auth.middleware.js";

const router = Router();

// All routes require authentication
router.use(auth);

// === DIRECT MESSAGING ===

// Get or create conversation
router.post("/conversations", controller.getOrCreateConversation);

// Get user's conversations (inbox)
router.get("/conversations", controller.getUserConversations);

// Get messages in a conversation
router.get("/conversations/:conversationId/messages", controller.getConversationMessages);

// === SUPPORT CHAT ===

// Create support ticket
router.post("/support/tickets", controller.createSupportTicket);

// Get user's support tickets
router.get("/support/tickets", controller.getUserSupportTickets);

// Get support ticket details with messages
router.get("/support/tickets/:ticketId", controller.getSupportTicketDetails);

// === ADMIN ROUTES ===

// Update ticket status (admin only)
router.put("/support/tickets/:ticketId/status", controller.updateTicketStatus);

// Get all support tickets (admin only)
router.get("/support/admin/tickets", controller.getAllSupportTickets);

export default router;
