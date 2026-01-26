import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MessageCircle, Plus, Search } from "lucide-react";
import Chat from "./Chat";
import { io } from "socket.io-client";

export default function Inbox() {
  const location = useLocation();

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
  const [userSearchResults, setUserSearchResults] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(
    location.state?.currentUserId || null
  );
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  // Map role_id to readable role string
  const roleMap = {
    1: "traveller",
    2: "agency",
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("online-users", (users) => {
      setOnlineUsers(users);
    });

    return () => socket.off("online-users");
  }, [socket]);

  // Fetch current user
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
          setCurrentUserRole(roleMap[data.user.role_id]);
        } catch (err) {
          console.error(err);
        }
      };
      fetchCurrentUser();
    }
  }, [currentUserId]);

  // Initialize socket after getting current user
  useEffect(() => {
    if (!currentUserId) return;

    const newSocket = io("http://localhost:5000", {
      auth: { token: localStorage.getItem("authToken") },
      transports: ["websocket", "polling"],
    });

    setSocket(newSocket);

    newSocket.emit("user-online", {
      userId: currentUserId,
      role: currentUserRole,
    });

    newSocket.on("conversation-updated", ({ conversationId }) => {
      fetchConversations();
    });

    newSocket.on("message-read", ({ messageId }) => {
      fetchConversations();
    });

    return () => newSocket.disconnect();
  }, [currentUserId, currentUserRole]);

  // Fetch conversations
  useEffect(() => {
    if (currentUserId) fetchConversations();
  }, [currentUserId]);

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
      console.log(data);
      // Convert role_id to string
      const formatted = data.map((conv) => ({
        ...conv,
      }));
      setConversations(formatted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (conversationId) => {
    try {
      const token = localStorage.getItem("authToken");
      await fetch(
        `http://localhost:5000/api/messaging/conversations/${conversationId}/mark-read`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId ? { ...c, unread_count: 0 } : c
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectConversation = (conv) => {
    setSelectedConversation(conv.id);
    setSelectedUserName(conv.other_user_name);
    setSelectedUserId(conv.other_user_id);
    markAsRead(conv.id);
  };

  const handleUserSearch = async (term) => {
    setNewChatUser(term);
    if (!term.trim()) {
      setUserSearchResults([]);
      return;
    }
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(
        `http://localhost:5000/api/user/search?query=${term}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setUserSearchResults(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartNewChat = async (otherUserId) => {
    if (!otherUserId || !currentUserId) return;
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
          body: JSON.stringify({ otherUserId }),
        }
      );
      if (!res.ok) throw new Error("Failed to start conversation");
      const newConversation = await res.json();

      setConversations((prev) => [newConversation, ...prev]);
      setSelectedConversation(newConversation.id);
      setSelectedUserName(newConversation.other_user_name || "Unknown");
      setSelectedUserId(otherUserId);
      setShowNewChat(false);
      setNewChatUser("");
      setUserSearchResults([]);
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
  console.log(filteredConversations);

  return (
    <div className="flex h-full bg-white overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
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

        {/* New Chat */}
        {showNewChat && currentUserRole && (
          <div className="p-4 border-b border-gray-200 bg-blue-50">
            <input
              type="text"
              placeholder="Search user..."
              value={newChatUser}
              onChange={(e) => handleUserSearch(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:border-blue-500"
            />
            {userSearchResults.length > 0 && (
              <div className="max-h-40 overflow-y-auto mb-2">
                {userSearchResults.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => handleStartNewChat(u.id)}
                    className="w-full text-left px-2 py-1 hover:bg-blue-100 rounded"
                  >
                    {u.username}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Conversations */}
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
                onClick={() => handleSelectConversation(conv)}
                className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition ${
                  selectedConversation === conv.id ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="relative">
                    <img
                      src={
                        conv.other_user_avatar
                          ? `http://localhost:5000/uploads/avatars/${conv.other_user_avatar}`
                          : "/default-avatar.png"
                      }
                      alt="avatar"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {onlineUsers.includes(conv.other_user_id) && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>

                  {/* Name + Role */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-800">
                        {conv.other_user_name}
                      </h3>

                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                        {conv.other_user_role}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 truncate">
                      {conv.last_message}
                    </p>
                  </div>

                  {/* Unread badge */}
                  {conv.unread_count > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                      {conv.unread_count}
                    </span>
                  )}

                  {/* Total messages badge */}
                  {conv.total_messages > 0 && (
                    <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 ml-2">
                      {conv.total_messages} msg
                      {conv.total_messages > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
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
            currentUserRole={currentUserRole}
            socket={socket}
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
