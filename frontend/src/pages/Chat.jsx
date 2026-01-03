import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { io } from "socket.io-client";

export default function Chat({ conversationId, otherUserName, otherUserId, currentUserId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!currentUserId) return;

    const token = localStorage.getItem("authToken");

    // Initialize Socket.io
    socketRef.current = io("http://localhost:5000", {
      auth: { token },
      transports: ["websocket", "polling"]
    });

    socketRef.current.emit("user-online", currentUserId);
    socketRef.current.emit("join-conversation", conversationId);

    fetchMessages();

    socketRef.current.on("message-received", (message) => {
      setMessages(prev => [...prev, message]);
      scrollToBottom();
    });

    socketRef.current.on("user-typing", () => setOtherUserTyping(true));
    socketRef.current.on("user-stopped-typing", () => setOtherUserTyping(false));

    return () => socketRef.current?.disconnect();
  }, [conversationId, currentUserId]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const res = await fetch(
        `http://localhost:5000/api/messaging/conversations/${conversationId}/messages`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setMessages(data);
      scrollToBottom();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);

    socketRef.current.emit("send-message", {
      conversationId,
      senderId: currentUserId,
      message: newMessage
    });

    setNewMessage("");
    socketRef.current.emit("stop-typing", { conversationId, userId: currentUserId });
    setSending(false);
  };

  const handleTyping = () => {
    if (!typing) {
      setTyping(true);
      socketRef.current.emit("typing", { conversationId, userId: currentUserId });
      setTimeout(() => {
        setTyping(false);
        socketRef.current.emit("stop-typing", { conversationId, userId: currentUserId });
      }, 3000);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 shadow-lg">
        <h2 className="text-xl font-bold">{otherUserName}</h2>
        <p className="text-sm text-blue-100">Online</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.sender_id === currentUserId ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.sender_id === currentUserId
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-800 rounded-bl-none"
                }`}
              >
                <p>{msg.message_text}</p>
                <p className="text-xs mt-1 opacity-70">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))
        )}
        {otherUserTyping && (
          <div className="flex items-center space-x-2 text-gray-500">
            <span className="text-sm">{otherUserName} is typing</span>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="border-t p-4 bg-gray-50">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => { setNewMessage(e.target.value); handleTyping(); }}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={sending || !newMessage.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50 flex items-center gap-2"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}
