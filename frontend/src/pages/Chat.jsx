import { useState, useEffect, useRef, useCallback } from "react";
import { format } from "date-fns";
import {
  FaPaperPlane,
  FaCheck,
  FaCheckDouble
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function Chat({
  conversationId,
  otherUserName,
  currentUserId,
  socket
}) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [remoteTyping, setRemoteTyping] = useState(false);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const chatContainerRef = useRef(null);
  const isFirstLoad = useRef(true);

  /* ======================
     FETCH MESSAGES (ONCE)
  ====================== */
  useEffect(() => {
    if (!conversationId) return;

    const fetchMessages = async () => {
      const token = localStorage.getItem("authToken");
      const res = await fetch(
        `http://localhost:5000/api/messaging/conversations/${conversationId}/messages`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setMessages(data);
      // Scroll to bottom on initial load
      setShouldScrollToBottom(true);
    };

    fetchMessages();
  }, [conversationId]);

  /* ======================
     SOCKET SETUP
  ====================== */
  useEffect(() => {
    if (!socket || !conversationId) return;

    socket.emit("join-conversation", conversationId);

    /* MESSAGE FROM SERVER */
    const onMessageReceived = (message) => {
      setMessages((prev) => {
        // Replace optimistic message
        const index = prev.findIndex(
          (m) => m.tempId && m.tempId === message.tempId
        );

        if (index !== -1) {
          const updated = [...prev];
          updated[index] = message;
          return updated;
        }

        // Avoid duplicates
        if (prev.some((m) => m.id === message.id)) return prev;

        // Only scroll if new message is from other user or if we're near bottom
        if (message.sender_id !== currentUserId) {
          setShouldScrollToBottom(true);
        }

        return [...prev, message];
      });
    };

    const onTyping = ({ userId }) => {
      if (userId !== currentUserId) setRemoteTyping(true);
    };

    const onStopTyping = ({ userId }) => {
      if (userId !== currentUserId) setRemoteTyping(false);
    };

    const onMessageRead = ({ messageId }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId ? { ...m, is_read: true } : m
        )
      );
    };

    socket.on("message-received", onMessageReceived);
    socket.on("user-typing", onTyping);
    socket.on("user-stopped-typing", onStopTyping);
    socket.on("message-read", onMessageRead);

    return () => {
      socket.off("message-received", onMessageReceived);
      socket.off("user-typing", onTyping);
      socket.off("user-stopped-typing", onStopTyping);
      socket.off("message-read", onMessageRead);
    };
  }, [socket, conversationId, currentUserId]);

  /* ======================
     SMART SCROLL HANDLING
  ====================== */
  useEffect(() => {
    if (!shouldScrollToBottom) return;
    
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({
        behavior: isFirstLoad.current ? "auto" : "smooth"
      });
      isFirstLoad.current = false;
      setShouldScrollToBottom(false);
    };

    // Small delay to ensure DOM is updated
    const timer = setTimeout(scrollToBottom, 50);
    return () => clearTimeout(timer);
  }, [shouldScrollToBottom]);

  /* ======================
     HANDLE MANUAL SCROLL
  ====================== */
  const handleContainerScroll = useCallback(() => {
    if (!chatContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    
    // If user is near bottom, auto-scroll for new messages
    if (isNearBottom) {
      setShouldScrollToBottom(true);
    }
  }, []);

  /* ======================
     SEND MESSAGE (OPTIMISTIC)
  ====================== */
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const tempId = `temp-${Date.now()}`;

    const optimisticMessage = {
      tempId,
      conversationId,
      sender_id: currentUserId,
      message_text: newMessage,
      created_at: new Date().toISOString(),
      is_read: false,
      optimistic: true
    };

    // 1️⃣ Show instantly WITHOUT triggering scroll
    setMessages((prev) => [...prev, optimisticMessage]);
    
    // Don't auto-scroll when we send a message (user might want to see history)
    // Only scroll if they're already near bottom
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      if (isNearBottom) {
        setShouldScrollToBottom(true);
      }
    }

    // 2️⃣ Send to server
    socket.emit("send-message", {
      conversationId,
      senderId: currentUserId,
      message: newMessage,
      tempId
    });

    // 3️⃣ Clear typing
    socket.emit("stop-typing", {
      conversationId,
      userId: currentUserId
    });

    // 4️⃣ Clear input
    setNewMessage("");
  };

  /* ======================
     TYPING HANDLER
  ====================== */
  const handleTyping = (e) => {
    const value = e.target.value;
    setNewMessage(value);

    // Only emit typing events if there's content
    if (value.trim()) {
      socket.emit("typing", {
        conversationId,
        userId: currentUserId
      });

      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("stop-typing", {
          conversationId,
          userId: currentUserId
        });
      }, 1000);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (time) =>
    format(new Date(time), "h:mm a");

  /* ======================
     RENDER
  ====================== */
  return (
    <div className="flex flex-col h-full bg-white">
      {/* HEADER */}
      <div className="p-4 border-b">
        <h2 className="font-bold">{otherUserName}</h2>
        <p className="text-sm text-gray-500">
          {remoteTyping ? "typing..." : "Online"}
        </p>
      </div>

      {/* MESSAGES CONTAINER */}
      <div 
        ref={chatContainerRef}
        onScroll={handleContainerScroll}
        className="flex-1 overflow-y-auto p-4 space-y-3"
      >
        {messages.map((msg) => {
          const isOwn = msg.sender_id === currentUserId;

          return (
            <motion.div
              key={msg.id || msg.tempId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[65%] p-3 rounded-2xl ${
                  isOwn
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100"
                }`}
              >
                <p>{msg.message_text}</p>

                <div className="flex justify-end gap-1 text-xs opacity-70 mt-1">
                  {formatTime(msg.created_at)}
                  {isOwn && (
                    msg.optimistic ? (
                      <FaCheck className="opacity-50" />
                    ) : msg.is_read ? (
                      <FaCheckDouble />
                    ) : (
                      <FaCheck />
                    )
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}

        <AnimatePresence>
          {remoteTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-start"
            >
              <div className="bg-gray-100 max-w-[65%] p-3 rounded-2xl">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Invisible element for scrolling */}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div className="p-4 border-t flex gap-2">
        <textarea
          value={newMessage}
          onChange={handleTyping}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 resize-none border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows="1"
        />
        <button
          onClick={handleSendMessage}
          disabled={!newMessage.trim()}
          className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
}