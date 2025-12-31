import {
  getConversations,
  saveConversations,
  getMessages,
  saveMessages,
  getSupportTickets,
  saveSupportTickets,
  getSupportMessages,
  saveSupportMessages,
  generateId
} from "../data/fileHelpers.js";
import pool from "../db.js";

// Get or create conversation between two users
export const getOrCreateConversation = async (req, res) => {
  const { otherUserId } = req.body;
  const userId = req.user.id;

  try {
    const conversations = await getConversations();

    // Check if conversation exists
    const existingConversation = conversations.find(
      (c) =>
        (c.user1_id === userId && c.user2_id === otherUserId) ||
        (c.user1_id === otherUserId && c.user2_id === userId)
    );

    if (existingConversation) {
      return res.json(existingConversation);
    }

    // Create new conversation
    const newConversation = {
      id: generateId(),
      user1_id: userId,
      user2_id: otherUserId,
      created_at: new Date().toISOString(),
      last_message_at: null
    };

    conversations.push(newConversation);
    await saveConversations(conversations);

    res.status(201).json(newConversation);
  } catch (error) {
    res.status(500).json({ message: "Error getting/creating conversation", error: error.message });
  }
};

// Get user's conversations (inbox)
export const getUserConversations = async (req, res) => {
  const userId = req.user.id;

  try {
    const [conversations] = await pool.query(
      `SELECT c.*, 
        CASE WHEN c.user1_id = ? THEN u.username ELSE u2.username END as other_user_name,
        CASE WHEN c.user1_id = ? THEN u.email ELSE u2.email END as other_user_email,
        CASE WHEN c.user1_id = ? THEN c.user2_id ELSE c.user1_id END as other_user_id,
        m.message_text as last_message,
        COUNT(CASE WHEN m.is_read = FALSE AND m.sender_id != ? THEN 1 END) as unread_count,
        MAX(m.created_at) as last_message_at
      FROM conversations c
      LEFT JOIN users u ON c.user2_id = u.id
      LEFT JOIN users u2 ON c.user1_id = u2.id
      LEFT JOIN messages m ON c.id = m.conversation_id
      WHERE c.user1_id = ? OR c.user2_id = ?
      GROUP BY c.id
      ORDER BY last_message_at DESC`,
      [userId, userId, userId, userId, userId, userId]
    );

    res.json(conversations); // ✅ must be an array
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching conversations", error: error.message });
  }
};


// Get messages in a conversation
export const getConversationMessages = async (req, res) => {
  const { conversationId } = req.params;

  try {
    const messages = await getMessages();
    const conversationMessages = messages.filter((m) => m.conversation_id === conversationId);

    res.json(conversationMessages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages", error: error.message });
  }
};

// Create support ticket
export const createSupportTicket = async (req, res) => {
  const { subject, description, category } = req.body;
  const userId = req.user.id;

  try {
    const tickets = await getSupportTickets();

    const newTicket = {
      id: generateId(),
      user_id: userId,
      subject,
      description,
      category,
      status: "open",
      priority: "medium",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    tickets.push(newTicket);
    await saveSupportTickets(tickets);

    res.status(201).json(newTicket);
  } catch (error) {
    res.status(500).json({ message: "Error creating support ticket", error: error.message });
  }
};

// Get user's support tickets
export const getUserSupportTickets = async (req, res) => {
  const userId = req.user.id;

  try {
    const tickets = await getSupportTickets();
    const userTickets = tickets.filter((t) => t.user_id === userId);

    res.json(userTickets);
  } catch (error) {
    res.status(500).json({ message: "Error fetching support tickets", error: error.message });
  }
};

// Get support ticket details with messages
export const getSupportTicketDetails = async (req, res) => {
  const { ticketId } = req.params;

  try {
    const tickets = await getSupportTickets();
    const messages = await getSupportMessages();

    const ticket = tickets.find((t) => t.id === ticketId);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const ticketMessages = messages.filter((m) => m.ticket_id === ticketId);

    res.json({
      ...ticket,
      messages: ticketMessages
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching support ticket", error: error.message });
  }
};

// Update support ticket status (admin only)
export const updateTicketStatus = async (req, res) => {
  const { ticketId } = req.params;
  const { status, priority } = req.body;

  try {
    const tickets = await getSupportTickets();
    const ticket = tickets.find((t) => t.id === ticketId);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    ticket.status = status;
    ticket.priority = priority;
    ticket.updated_at = new Date().toISOString();

    await saveSupportTickets(tickets);

    res.json({ message: "Ticket updated successfully", ticket });
  } catch (error) {
    res.status(500).json({ message: "Error updating ticket", error: error.message });
  }
};

// Get all support tickets (admin only)
export const getAllSupportTickets = async (req, res) => {
  try {
    const tickets = await getSupportTickets();

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Error fetching support tickets", error: error.message });
  }
};
