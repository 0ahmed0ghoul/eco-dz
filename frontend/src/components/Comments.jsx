import { useState, useEffect } from "react";
import { Heart, Send, Loader, MessageCircle, X } from "lucide-react";

export default function Comments({ destinationId, destinationType = "place" }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [likedComments, setLikedComments] = useState(new Set());
  const [likedReplies, setLikedReplies] = useState(new Set());
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");

  // Fetch comments when component mounts
  useEffect(() => {
    fetchComments();
  }, [destinationId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const response = await fetch(
        `http://localhost:5000/api/comments?type=${destinationType}&id=${destinationId}&userId=${user.id || ''}`
      );
      const data = await response.json();
      setComments(data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      alert("Please write a comment");
      return;
    }

    const token = localStorage.getItem("authToken");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    
    // Get user info - either from login or guest fields
    const userName = user.name || guestName || "Guest";
    const userEmail = user.email || guestEmail || "guest@example.com";
    const userId = user.id || `guest_${Date.now()}`;

    // Validate guest fields if not logged in
    if (!token && (!guestName.trim() || !guestEmail.trim())) {
      alert("Please enter your name and email to comment as a guest");
      return;
    }

    try {
      setSubmitting(true);
      const headers = {
        "Content-Type": "application/json"
      };
      
      // Only add auth header if user is logged in
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch("http://localhost:5000/api/comments", {
        method: "POST",
        headers,
        body: JSON.stringify({
          type: destinationType,
          destination_id: destinationId,
          rating,
          comment_text: newComment,
          user_name: userName,
          user_email: userEmail,
          user_id: userId,
        }),
      });

      if (response.ok) {
        const newCommentData = await response.json();
        setComments([newCommentData, ...comments]);
        setNewComment("");
        setRating(5);
        if (!token) {
          setGuestName("");
          setGuestEmail("");
        }
      } else if (response.status === 401) {
        alert("Session expired. Please login again");
      } else {
        alert("Failed to post comment");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async (e, commentId) => {
    e.preventDefault();
    
    if (!replyText.trim()) {
      alert("Please write a reply");
      return;
    }

    const token = localStorage.getItem("authToken");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    
    if (!token || !user.id) {
      alert("Please login to reply");
      return;
    }

    try {
      setSubmittingReply(true);
      const response = await fetch(`http://localhost:5000/api/comments/${commentId}/replies`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          reply_text: replyText,
        }),
      });

      if (response.ok) {
        const newReplyData = await response.json();
        setComments(comments.map(c => 
          c.id === commentId 
            ? { ...c, replies: [...(c.replies || []), newReplyData] }
            : c
        ));
        setReplyText("");
        setReplyingTo(null);
      } else if (response.status === 401) {
        alert("Session expired. Please login again");
      }
    } catch (error) {
      console.error("Error submitting reply:", error);
      alert("Failed to post reply");
    } finally {
      setSubmittingReply(false);
    }
  };

  const toggleLike = async (commentId) => {
    const token = localStorage.getItem("authToken");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    
    if (!token || !user.id) {
      alert("Please login to like comments");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/comments/${commentId}/like`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const result = await response.json();
        setComments(comments.map(c =>
          c.id === commentId
            ? { 
                ...c, 
                userLiked: result.liked,
                likes: result.liked ? c.likes + 1 : c.likes - 1
              }
            : c
        ));
      }
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const toggleLikeReply = async (replyId, commentId) => {
    const token = localStorage.getItem("authToken");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    
    if (!token || !user.id) {
      alert("Please login to like replies");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/comments/replies/${replyId}/like`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const result = await response.json();
        setComments(comments.map(c =>
          c.id === commentId
            ? {
                ...c,
                replies: c.replies.map(r =>
                  r.id === replyId
                    ? {
                        ...r,
                        userLiked: result.liked,
                        likes: result.liked ? r.likes + 1 : r.likes - 1
                      }
                    : r
                )
              }
            : c
        ));
      }
    } catch (error) {
      console.error("Error liking reply:", error);
    }
  };

  const averageRating = comments.length > 0
    ? (comments.reduce((sum, c) => sum + c.rating, 0) / comments.length).toFixed(1)
    : 0;

  return (
    <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
      {/* Comments Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Reviews & Comments</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < Math.round(averageRating) ? "text-yellow-400 text-xl" : "text-gray-300 text-xl"}>
                ★
              </span>
            ))}
          </div>
          <span className="text-lg font-semibold text-gray-700">
            {averageRating} ({comments.length} reviews)
          </span>
        </div>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmitComment} className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
        {/* Guest Fields - Show only if not logged in */}
        {!localStorage.getItem("authToken") && (
          <div className="mb-4 space-y-3">
            <p className="text-sm text-gray-600 font-semibold">Comment as a Guest</p>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Your name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <input
                type="email"
                placeholder="Your email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Your Rating
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-3xl transition-all ${
                  star <= rating ? "text-yellow-400 scale-110" : "text-gray-300"
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your experience with this destination..."
          className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
          rows="4"
          disabled={submitting}
        />

        <button
          type="submit"
          disabled={submitting}
          className="mt-4 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50"
        >
          {submitting ? (
            <>
              <Loader size={20} className="animate-spin" />
              Posting...
            </>
          ) : (
            <>
              <Send size={20} />
              Post Comment
            </>
          )}
        </button>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-8">
            <Loader size={24} className="animate-spin mx-auto text-blue-500" />
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="border-l-4 border-blue-500 p-4 bg-gray-50 rounded">
              {/* Main Comment */}
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-gray-800">{comment.user_name}</h4>
                  <p className="text-sm text-gray-500">{comment.user_email}</p>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < comment.rating ? "text-yellow-400" : "text-gray-300"}>
                      ★
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-gray-700 mb-3">{comment.comment_text}</p>

              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <span>{new Date(comment.created_at).toLocaleDateString()}</span>
                <div className="flex gap-4">
                  <button
                    onClick={() => toggleLike(comment.id)}
                    className={`flex items-center gap-1 transition-all ${
                      comment.userLiked
                        ? "text-red-500 font-semibold"
                        : "text-gray-400 hover:text-red-500"
                    }`}
                  >
                    <Heart size={16} fill={comment.userLiked ? "currentColor" : "none"} />
                    {comment.likes || 0}
                  </button>
                  <button
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    className="flex items-center gap-1 text-gray-400 hover:text-blue-500 transition-all"
                  >
                    <MessageCircle size={16} />
                    Reply
                  </button>
                </div>
              </div>

              {/* Reply Form */}
              {replyingTo === comment.id && (
                <form onSubmit={(e) => handleSubmitReply(e, comment.id)} className="mb-4 p-4 bg-blue-50 rounded border border-blue-200">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply..."
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 resize-none text-sm"
                    rows="2"
                    disabled={submittingReply}
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      type="submit"
                      disabled={submittingReply}
                      className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 transition-all disabled:opacity-50"
                    >
                      {submittingReply ? (
                        <>
                          <Loader size={14} className="animate-spin" />
                          Posting...
                        </>
                      ) : (
                        <>
                          <Send size={14} />
                          Reply
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyText("");
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-400 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Replies Section */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 ml-4 space-y-3 border-l-2 border-gray-300 pl-4">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="bg-white p-3 rounded border border-gray-200">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h5 className="font-semibold text-gray-700 text-sm">{reply.user_name}</h5>
                          <p className="text-xs text-gray-500">{reply.user_email}</p>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm mb-2">{reply.reply_text}</p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>{new Date(reply.created_at).toLocaleDateString()}</span>
                        <button
                          onClick={() => toggleLikeReply(reply.id, comment.id)}
                          className={`flex items-center gap-1 transition-all ${
                            reply.userLiked
                              ? "text-red-500 font-semibold"
                              : "text-gray-400 hover:text-red-500"
                          }`}
                        >
                          <Heart size={14} fill={reply.userLiked ? "currentColor" : "none"} />
                          {reply.likes || 0}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">
            No comments yet. Be the first to share your experience!
          </p>
        )}
      </div>
    </div>
  );
}
