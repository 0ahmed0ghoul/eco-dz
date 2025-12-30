import pool from "../db.js";

// Get or create conversation between two users
export const getOrCreateConversation = async (req, res) => {
  const { otherUserId } = req.body;
  const userId = req.user.id;

  try {
    // Check if conversation exists
    let [conversation] = await pool.query(
      "SELECT * FROM conversations WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)",
      [userId, otherUserId, otherUserId, userId]
    );

    if (conversation.length > 0) {
      return res.json(conversation[0]);
    }

    // Create new conversation
    const [result] = await pool.query(
      "INSERT INTO conversations (user1_id, user2_id) VALUES (?, ?)",
      [userId, otherUserId]
    );

    const newConversation = {
      id: result.insertId,
      user1_id: userId,
      user2_id: otherUserId,
      created_at: new Date().toISOString()
    };

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
    const [messages] = await pool.query(
      "SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC",
      [conversationId]
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages", error: error.message });
  }
};

// Create support ticket
export const createSupportTicket = async (req, res) => {
  const { subject, description, category } = req.body;
  const userId = req.user.id;

  try {
    const [result] = await pool.query(
      "INSERT INTO support_tickets (user_id, subject, description, category) VALUES (?, ?, ?, ?)",
      [userId, subject, description, category]
    );

    const ticket = {
      id: result.insertId,
      user_id: userId,
      subject,
      description,
      category,
      status: "open",
      priority: "medium",
      created_at: new Date().toISOString()
    };

    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Error creating support ticket", error: error.message });
  }
};

// Get user's support tickets
export const getUserSupportTickets = async (req, res) => {
  const userId = req.user.id;

  try {
    const [tickets] = await pool.query(
      "SELECT * FROM support_tickets WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Error fetching support tickets", error: error.message });
  }
};

// Get support ticket details with messages
export const getSupportTicketDetails = async (req, res) => {
  const { ticketId } = req.params;

  try {
    const [ticket] = await pool.query(
      "SELECT * FROM support_tickets WHERE id = ?",
      [ticketId]
    );

    if (ticket.length === 0) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const [messages] = await pool.query(
      "SELECT * FROM support_messages WHERE ticket_id = ? ORDER BY created_at ASC",
      [ticketId]
    );

    res.json({
      ...ticket[0],
      messages
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
    await pool.query(
      "UPDATE support_tickets SET status = ?, priority = ? WHERE id = ?",
      [status, priority, ticketId]
    );

    res.json({ message: "Ticket updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating ticket", error: error.message });
  }
};

// Get all support tickets (admin only)
export const getAllSupportTickets = async (req, res) => {
  try {
    const [tickets] = await pool.query(
      "SELECT * FROM support_tickets ORDER BY created_at DESC"
    );

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Error fetching support tickets", error: error.message });
  }
};
