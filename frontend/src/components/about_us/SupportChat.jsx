import { useState, useEffect, useRef } from "react";
import { Send, Plus, AlertCircle, CheckCircle2 } from "lucide-react";
import { io } from "socket.io-client";

export default function SupportChat() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketDetails, setTicketDetails] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    category: "general"
  });
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchTickets();
    initSocket();
  }, []);

  const initSocket = () => {
    const token = localStorage.getItem("authToken");
    socketRef.current = io("http://localhost:5000", {
      auth: { token }
    });

    socketRef.current.on("support-message-received", (message) => {
      setTicketDetails(prev => ({
        ...prev,
        messages: [...(prev?.messages || []), message]
      }));
      scrollToBottom();
    });
  };

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:5000/api/messaging/support/tickets", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTicketDetails = async (ticketId) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:5000/api/messaging/support/tickets/${ticketId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setTicketDetails(data);
      setSelectedTicket(ticketId);
      
      if (socketRef.current) {
        socketRef.current.emit("join-support", ticketId);
      }
      scrollToBottom();
    } catch (error) {
      console.error("Error fetching ticket details:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:5000/api/messaging/support/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const newTicket = await response.json();
        setTickets([newTicket, ...tickets]);
        setFormData({ subject: "", description: "", category: "general" });
        setShowNewTicket(false);
        fetchTicketDetails(newTicket.id);
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedTicket) return;

    setSending(true);
    const user = JSON.parse(localStorage.getItem("user"));

    socketRef.current.emit("send-support-message", {
      ticketId: selectedTicket,
      senderId: user.id,
      message: newMessage,
      isAdmin: false
    });

    setNewMessage("");
  };

  const getStatusBadge = (status) => {
    const colors = {
      open: "bg-yellow-100 text-yellow-800",
      "in_progress": "bg-blue-100 text-blue-800",
      resolved: "bg-green-100 text-green-800",
      closed: "bg-gray-100 text-gray-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading support tickets...</div>;
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Tickets Sidebar */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Support</h2>
            <button
              onClick={() => setShowNewTicket(!showNewTicket)}
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* New Ticket Form */}
        {showNewTicket && (
          <form onSubmit={handleCreateTicket} className="p-4 border-b border-gray-200 bg-blue-50 space-y-3">
            <input
              type="text"
              placeholder="Subject..."
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
              required
            />
            <textarea
              placeholder="Describe your issue..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm resize-none"
              rows="3"
              required
            />
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
            >
              <option value="general">General</option>
              <option value="booking">Booking</option>
              <option value="destination">Destination</option>
              <option value="complaint">Complaint</option>
            </select>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
            >
              Create Ticket
            </button>
          </form>
        )}

        {/* Tickets List */}
        <div className="flex-1 overflow-y-auto">
          {tickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
              <AlertCircle size={48} className="mb-2 opacity-50" />
              <p className="text-center">No support tickets yet</p>
            </div>
          ) : (
            tickets.map((ticket) => (
              <button
                key={ticket.id}
                onClick={() => fetchTicketDetails(ticket.id)}
                className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition ${
                  selectedTicket === ticket.id ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-800 text-sm">{ticket.subject}</h3>
                  <span className={`text-xs px-2 py-1 rounded ${getStatusBadge(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </div>
                <p className="text-xs text-gray-600 truncate">{ticket.description}</p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedTicket && ticketDetails ? (
          <>
            {/* Ticket Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 shadow-lg">
              <h2 className="text-xl font-bold">{ticketDetails.subject}</h2>
              <p className="text-sm text-blue-100">{ticketDetails.description}</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {!ticketDetails.messages || ticketDetails.messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No messages yet. Describe your issue below.
                </div>
              ) : (
                ticketDetails.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.is_admin ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.is_admin
                          ? "bg-gray-200 text-gray-800"
                          : "bg-blue-500 text-white rounded-br-none"
                      }`}
                    >
                      {msg.is_admin && <p className="text-xs font-semibold mb-1">Support Team</p>}
                      <p>{msg.message_text}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {new Date(msg.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            {ticketDetails.status !== "closed" && (
              <form onSubmit={handleSendMessage} className="border-t p-4 bg-gray-50">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
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
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <AlertCircle size={64} className="opacity-20 mr-4" />
            <p className="text-xl">Select a ticket to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}
