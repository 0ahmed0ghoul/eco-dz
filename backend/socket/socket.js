import { Server } from "socket.io";
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
        const messages = await getMessages();
        const conversations = await getConversations();

        const messageData = {
          id: generateId(),
          conversation_id: conversationId,
          sender_id: senderId,
          message_text: message,
          created_at: new Date().toISOString(),
          is_read: false
        };

        messages.push(messageData);
        await saveMessages(messages);

        // Update conversation's last message time
        const conversation = conversations.find((c) => c.id === conversationId);
        if (conversation) {
          conversation.last_message_at = new Date().toISOString();
          await saveConversations(conversations);
        }

        // Broadcast to conversation room
        io.to(`conversation-${conversationId}`).emit("message-received", messageData);
      } catch (error) {
        console.error("Error saving message:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // Mark message as read
    socket.on("mark-as-read", async (messageId) => {
      try {
        const messages = await getMessages();
        const message = messages.find((m) => m.id === messageId);

        if (message) {
          message.is_read = true;
          message.read_at = new Date().toISOString();
          await saveMessages(messages);
        }

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
        const supportMessages = await getSupportMessages();
        const tickets = await getSupportTickets();

        const messageData = {
          id: generateId(),
          ticket_id: ticketId,
          sender_id: senderId,
          message_text: message,
          is_admin: isAdmin || false,
          created_at: new Date().toISOString()
        };

        supportMessages.push(messageData);
        await saveSupportMessages(supportMessages);

        // Update ticket's updated_at
        const ticket = tickets.find((t) => t.id === ticketId);
        if (ticket) {
          ticket.updated_at = new Date().toISOString();
          await saveSupportTickets(tickets);
        }

        // Broadcast to support room
        io.to(`support-${ticketId}`).emit("support-message-received", messageData);
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
