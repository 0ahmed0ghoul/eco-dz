import pool from "../db.js";

// ==============================
// GET OR CREATE CONVERSATION
// ==============================
export const getOrCreateConversation = async (req, res) => {
  const userId = req.user.id;
  const { otherUserId } = req.body;

  if (!otherUserId) return res.status(400).json({ message: "otherUserId is required" });

  const user1 = Math.min(userId, otherUserId);
  const user2 = Math.max(userId, otherUserId);

  try {
    // Check if conversation exists
    const [existing] = await pool.query(
      "SELECT * FROM conversations WHERE user1_id = ? AND user2_id = ?",
      [user1, user2]
    );

    if (existing.length > 0) {
      // Fetch last message for inbox display
      const [lastMessage] = await pool.query(
        `SELECT message_text, created_at 
         FROM messages 
         WHERE conversation_id = ? 
         ORDER BY created_at DESC LIMIT 1`,
        [existing[0].id]
      );

      return res.json({
        ...existing[0],
        last_message: lastMessage[0]?.message_text || null,
        last_message_at: lastMessage[0]?.created_at || null
      });
    }

    // Create new conversation
    const [result] = await pool.query(
      "INSERT INTO conversations (user1_id, user2_id) VALUES (?, ?)",
      [user1, user2]
    );

    const [newConv] = await pool.query(
      `SELECT c.id,
              CASE WHEN c.user1_id = ? THEN u2.username ELSE u.username END AS other_user_name,
              CASE WHEN c.user1_id = ? THEN c.user2_id ELSE c.user1_id END AS other_user_id,
              CASE WHEN c.user1_id = ? THEN u2.role ELSE u.role END AS other_user_role,
              CASE WHEN c.user1_id = ? THEN u2.avatar ELSE u.avatar END AS other_user_avatar
       FROM conversations c
       LEFT JOIN users u ON u.id = c.user1_id
       LEFT JOIN users u2 ON u2.id = c.user2_id
       WHERE c.id = ?`,
      [userId, userId, userId, userId, result.insertId]
    );

    res.status(201).json({ ...newConv[0], last_message: null, last_message_at: null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Conversation error" });
  }
};

// ==============================
// GET USER CONVERSATIONS (INBOX)
// ==============================
export const getUserConversations = async (req, res) => {
  const userId = req.user.id;

  try {
    const [conversations] = await pool.query(
      `
      SELECT
        c.id,

        -- Determine "other user"
        CASE WHEN c.user1_id = ? THEN u2.id ELSE u1.id END AS other_user_id,
        CASE WHEN c.user1_id = ? THEN u2.username ELSE u1.username END AS other_user_name,
        CASE WHEN c.user1_id = ? THEN u2.avatar ELSE u1.avatar END AS other_user_avatar,
        CASE WHEN c.user1_id = ? THEN u2.role ELSE u1.role END AS other_user_role,

        m.message_text AS last_message,
        m.created_at AS last_message_at,

        SUM(CASE WHEN m.is_read = 0 AND m.receiver_id = ? THEN 1 ELSE 0 END) AS unread_count

      FROM conversations c
      JOIN users u1 ON u1.id = c.user1_id
      JOIN users u2 ON u2.id = c.user2_id

      LEFT JOIN messages m ON m.id = (
        SELECT id FROM messages
        WHERE conversation_id = c.id
        ORDER BY created_at DESC
        LIMIT 1
      )

      WHERE c.user1_id = ? OR c.user2_id = ?
      GROUP BY c.id, other_user_id, other_user_name, other_user_avatar, other_user_role, last_message, last_message_at
      ORDER BY last_message_at DESC
      `,
      [userId, userId, userId, userId, userId, userId, userId]
    );

    res.json(conversations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching conversations" });
  }
};

// ==============================
// GET MESSAGES IN CONVERSATION
// ==============================
export const getConversationMessages = async (req, res) => {
  const { conversationId } = req.params;
  const userId = req.user.id;

  try {
    const [messages] = await pool.query(
      `SELECT *
       FROM messages
       WHERE conversation_id = ?
         AND (sender_id = ? OR receiver_id = ?)
       ORDER BY created_at ASC`,
      [conversationId, userId, userId]
    );

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching messages" });
  }
};

// ==============================
// GET UNREAD MESSAGE COUNT
// ==============================
export const getUnreadCount = async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await pool.query(
      `SELECT COUNT(*) AS unreadCount
       FROM messages m
       JOIN conversations c ON m.conversation_id = c.id
       WHERE m.is_read = 0
         AND m.sender_id != ?
         AND (c.user1_id = ? OR c.user2_id = ?)`,
      [userId, userId, userId]
    );


    res.json({ unreadCount: rows[0].unreadCount || 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch unread count" });
  }
};

// ==============================
// MARK CONVERSATION AS READ
// ==============================
export const markConversationAsRead = async (req, res) => {
  const { conversationId } = req.params;
  const userId = req.user.id;

  try {
    await pool.query(
      `UPDATE messages
       SET is_read = 1, read_at = NOW()
       WHERE conversation_id = ? AND receiver_id = ? AND is_read = 0`,
      [conversationId, userId]
    );

    res.json({ message: "Messages marked as read" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to mark messages as read" });
  }
};

// ==============================
// INSERT NEW MESSAGE (FOR SOCKET.IO)
// ==============================
export const insertMessage = async (conversationId, senderId, messageText) => {
  // Fetch receiver from conversation
  const [conv] = await pool.query("SELECT * FROM conversations WHERE id = ?", [conversationId]);
  if (!conv[0]) throw new Error("Conversation not found");

  const receiverId = conv[0].user1_id === senderId ? conv[0].user2_id : conv[0].user1_id;

  const [result] = await pool.query(
    "INSERT INTO messages (conversation_id, sender_id, receiver_id, message_text) VALUES (?, ?, ?, ?)",
    [conversationId, senderId, receiverId, messageText]
  );

  return {
    id: result.insertId,
    conversation_id: conversationId,
    sender_id: senderId,
    receiver_id: receiverId,
    message_text: messageText,
    is_read: 0,
    created_at: new Date()
  };
};
