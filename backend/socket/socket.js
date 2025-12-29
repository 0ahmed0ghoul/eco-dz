import { Server } from "socket.io";
import pool from "../db.js";

export const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true
    }
  });

  const userSockets = {}; // Track online users

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // User comes online
    socket.on("user-online", (userId) => {
      userSockets[userId] = socket.id;
      socket.broadcast.emit("user-status-changed", { userId, status: "online" });
    });

    // User goes offline
    socket.on("disconnect", () => {
      for (let userId in userSockets) {
        if (userSockets[userId] === socket.id) {
          delete userSockets[userId];
          socket.broadcast.emit("user-status-changed", { userId, status: "offline" });
          break;
        }
      }
      console.log(`User disconnected: ${socket.id}`);
    });

    // Join a conversation room
    socket.on("join-conversation", (conversationId) => {
      socket.join(`conversation-${conversationId}`);
      console.log(`User joined conversation ${conversationId}`);
    });

    // Send direct message
    socket.on("send-message", async (data) => {
      const { conversationId, senderId, message } = data;

      try {
        // Save to database
        const [result] = await pool.query(
          "INSERT INTO messages (conversation_id, sender_id, message_text) VALUES (?, ?, ?)",
          [conversationId, senderId, message]
        );

        const messageData = {
          id: result.insertId,
          conversationId,
          senderId,
          message_text: message,
          created_at: new Date().toISOString(),
          is_read: false
        };

        // Broadcast to conversation room
        io.to(`conversation-${conversationId}`).emit("message-received", messageData);

        // Update last message time
        await pool.query(
          "UPDATE conversations SET last_message_at = NOW() WHERE id = ?",
          [conversationId]
        );
      } catch (error) {
        console.error("Error saving message:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // Mark message as read
    socket.on("mark-as-read", async (messageId) => {
      try {
        await pool.query(
          "UPDATE messages SET is_read = TRUE, read_at = NOW() WHERE id = ?",
          [messageId]
        );
        socket.broadcast.emit("message-read", { messageId });
      } catch (error) {
        console.error("Error marking message as read:", error);
      }
    });

    // Typing indicator
    socket.on("typing", (data) => {
      const { conversationId, userId } = data;
      socket.to(`conversation-${conversationId}`).emit("user-typing", { userId });
    });

    socket.on("stop-typing", (data) => {
      const { conversationId, userId } = data;
      socket.to(`conversation-${conversationId}`).emit("user-stopped-typing", { userId });
    });

    // Support chat - join support room
    socket.on("join-support", (ticketId) => {
      socket.join(`support-${ticketId}`);
      console.log(`User joined support ticket ${ticketId}`);
    });

    // Send support message
    socket.on("send-support-message", async (data) => {
      const { ticketId, senderId, message, isAdmin } = data;

      try {
        // Save to database
        const [result] = await pool.query(
          "INSERT INTO support_messages (ticket_id, sender_id, message_text, is_admin) VALUES (?, ?, ?, ?)",
          [ticketId, senderId, message, isAdmin || false]
        );

        const messageData = {
          id: result.insertId,
          ticketId,
          senderId,
          message_text: message,
          is_admin: isAdmin || false,
          created_at: new Date().toISOString()
        };

        // Broadcast to support room
        io.to(`support-${ticketId}`).emit("support-message-received", messageData);

        // Update ticket status if needed
        await pool.query(
          "UPDATE support_tickets SET updated_at = NOW() WHERE id = ?",
          [ticketId]
        );
      } catch (error) {
        console.error("Error saving support message:", error);
        socket.emit("error", { message: "Failed to send support message" });
      }
    });
  });

  return io;
};

export const getOnlineUsers = (io) => {
  return io.sockets.sockets;
};
