import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // ✅ add this
import { MessageCircle, Plus, Search } from "lucide-react";
import Chat from "./Chat";

export default function Inbox() {
  const location = useLocation(); // ✅ get state from navigation
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConversation, setSelectedConversation] = useState(
    location.state?.selectedConversation || null
  );
  const [selectedUserName, setSelectedUserName] = useState(
    location.state?.otherUserName || null
  );
  const [selectedUserId, setSelectedUserId] = useState(
    location.state?.otherUserId || null
  );
  const [showNewChat, setShowNewChat] = useState(false);
  const [newChatUser, setNewChatUser] = useState("");
  const [currentUserId, setCurrentUserId] = useState(
    location.state?.currentUserId || null
  );

  // Fetch current user ID if not passed
  useEffect(() => {
    if (!currentUserId) {
      const fetchCurrentUser = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) return;
        try {
          const res = await fetch("http://localhost:5000/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) throw new Error("Failed to fetch user");
          const data = await res.json();
          setCurrentUserId(data.user.id);
        } catch (err) {
          console.error(err);
        }
      };
      fetchCurrentUser();
    }
  }, [currentUserId]);

  // Fetch conversations
  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const res = await fetch(
        "http://localhost:5000/api/messaging/conversations",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setConversations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Start a new chat manually
  const handleStartNewChat = async () => {
    if (!newChatUser.trim() || !currentUserId) return;

    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(
        "http://localhost:5000/api/messaging/conversations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ otherUserId: parseInt(newChatUser) }),
        }
      );
      if (!res.ok) throw new Error("Failed to start conversation");
      const newConversation = await res.json();

      setConversations((prev) => [newConversation, ...prev]);
      setSelectedConversation(newConversation.id);
      setSelectedUserName(newConversation.other_user_name || "Unknown");
      setSelectedUserId(parseInt(newChatUser));
      setShowNewChat(false);
      setNewChatUser("");
    } catch (err) {
      console.error(err);
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.other_user_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        Loading conversations...
      </div>
    );

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Messages</h2>
            <button
              onClick={() => setShowNewChat(!showNewChat)}
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
            >
              <Plus size={20} />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-2.5 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* New Chat Form */}
        {showNewChat && (
          <div className="p-4 border-b border-gray-200 bg-blue-50">
            <input
              type="text"
              placeholder="Enter user ID..."
              value={newChatUser}
              onChange={(e) => setNewChatUser(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleStartNewChat}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Start Chat
            </button>
          </div>
        )}

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <MessageCircle size={48} className="mb-2 opacity-50" />
              <p>No conversations yet</p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => {
                  setSelectedConversation(conv.id);
                  setSelectedUserName(conv.other_user_name);
                  setSelectedUserId(conv.other_user_id);
                }}
                className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition ${
                  selectedConversation === conv.id ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-gray-800">
                    {conv.other_user_name}
                  </h3>
                  {conv.unread_count > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                      {conv.unread_count}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {conv.last_message}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(conv.last_message_at).toLocaleDateString()}
                </p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1">
        {selectedConversation && currentUserId ? (
          <Chat
            conversationId={selectedConversation}
            otherUserName={selectedUserName}
            otherUserId={selectedUserId}
            currentUserId={currentUserId}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <MessageCircle size={64} className="opacity-20 mr-4" />
            <p className="text-xl">Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}
