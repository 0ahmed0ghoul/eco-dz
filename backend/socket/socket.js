import { Server } from "socket.io";
import pool from "../db.js";
import { insertMessage } from "../controllers/messaging.controller.js";

// Declare io at module level
let io;

export const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    // Assign to module-level io
    cors: {
      origin: ["http://localhost:5173", "http://localhost:5174",`${process.env.FRONTEND_URL}`],
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"], // 🔥 important
  });

  // userId -> socketId
  const userSockets = new Map();

  io.on("connection", (socket) => {
    socket.on("user-online", ({ userId }) => {
      userSockets.set(userId, socket.id);

      io.emit("online-users", Array.from(userSockets.keys()));

      socket.broadcast.emit("user-status-changed", {
        userId,
        status: "online",
      });
    });

    socket.on("disconnect", () => {
      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          userSockets.delete(userId);

          io.emit("online-users", Array.from(userSockets.keys()));

          socket.broadcast.emit("user-status-changed", {
            userId,
            status: "offline",
          });
          break;
        }
      }
    });

    socket.on("join-conversation", (conversationId) => {
      socket.join(`conversation-${conversationId}`);
    });

    socket.on("join-support", (ticketId) => {
      socket.join(`support-${ticketId}`);
    });

    socket.on(
      "send-message",
      async ({ conversationId, senderId, message, tempId }) => {
        try {
          // Save message
          const savedMessage = await insertMessage(
            conversationId,
            senderId,
            message
          );

          // 🔥 Attach tempId for optimistic UI replacement
          const messageWithTempId = {
            ...savedMessage,
            tempId,
          };

          // Emit to conversation room
          io.to(`conversation-${conversationId}`).emit(
            "message-received",
            messageWithTempId
          );

          // Update conversation timestamp
          await pool.query(
            "UPDATE conversations SET last_message_at = NOW() WHERE id = ?",
            [conversationId]
          );

          // Notify receiver inbox
          const receiverSocket = userSockets.get(savedMessage.receiver_id);
          if (receiverSocket) {
            io.to(receiverSocket).emit("conversation-updated", {
              conversationId,
            });
          }

          // Notify sender inbox
          io.to(socket.id).emit("conversation-updated", {
            conversationId,
          });
        } catch (err) {
          console.error("send-message error:", err);

          socket.emit("message-failed", {
            tempId,
            error: "Failed to send message",
          });
        }
      }
    );

    socket.on("mark-as-read", async ({ messageId, conversationId }) => {
      try {
        await pool.query(
          "UPDATE messages SET is_read = TRUE, read_at = NOW() WHERE id = ?",
          [messageId]
        );

        io.to(`conversation-${conversationId}`).emit("message-read", {
          messageId,
        });
      } catch (err) {
        console.error("mark-as-read error:", err);
      }
    });

    socket.on("typing", ({ conversationId, userId }) => {
      socket
        .to(`conversation-${conversationId}`)
        .emit("user-typing", { userId });
    });

    socket.on("stop-typing", ({ conversationId, userId }) => {
      socket
        .to(`conversation-${conversationId}`)
        .emit("user-stopped-typing", { userId });
    });

    socket.on(
      "send-support-message",
      async ({ ticketId, senderId, message, isAdmin }) => {
        try {
          const [result] = await pool.query(
            `INSERT INTO support_messages 
           (ticket_id, sender_id, message_text, is_admin)
           VALUES (?, ?, ?, ?)`,
            [ticketId, senderId, message, isAdmin || false]
          );

          const messageData = {
            id: result.insertId,
            ticketId,
            senderId,
            message_text: message,
            is_admin: isAdmin || false,
            created_at: new Date().toISOString(),
          };

          io.to(`support-${ticketId}`).emit(
            "support-message-received",
            messageData
          );

          await pool.query(
            "UPDATE support_tickets SET updated_at = NOW() WHERE id = ?",
            [ticketId]
          );
        } catch (err) {
          console.error("support message error:", err);
          socket.emit("error", {
            message: "Failed to send support message",
          });
        }
      }
    );

    socket.on("join-review", (reviewId) => {
      socket.join(`review-${reviewId}`);
    });

    socket.on(
      "review-reacted",
      ({ reviewId, likes, dislikes, userReaction }) => {
        io.to(`review-${reviewId}`).emit("review-reaction-updated", {
          reviewId,
          likes,
          dislikes,
          userReaction,
        });
      }
    );

    // Join a room per place

    // In socket.js, update the join-review-place handler:
    socket.on("join-review-place", (placeId) => {
      console.log(`📍 User ${socket.id} joining review-place-${placeId}`);
      socket.join(`review-place-${placeId}`);

      // Send confirmation back to client
      socket.emit("room-joined", {
        room: `review-place-${placeId}`,
        placeId: placeId,
      });

      // Debug: List all rooms this socket is in
      const rooms = Array.from(socket.rooms);
      console.log(`📌 Socket ${socket.id} rooms:`, rooms);
      console.log(
        `👥 Total users in review-place-${placeId}:`,
        io.sockets.adapter.rooms.get(`review-place-${placeId}`)?.size || 0
      );
    });

    // Also add logging to the review add event:
    socket.on("review-added", (data) => {
      console.log(
        `📨 review-added event received from socket ${socket.id}:`,
        data
      );
    });
    // Add ping handler
    socket.on("ping", (startTime) => {
      const latency = Date.now() - startTime;
      socket.emit("pong", latency);
    });
    socket.on("review-reply-added", ({ reviewId, reply }) => {
      io.to(`review-${reviewId}`).emit("review-reply-received", {
        reviewId,
        reply,
      });
    });
  });

  return io;
};

// Export function to get io instance
export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
