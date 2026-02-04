import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaStar,
  FaThumbsUp,
  FaThumbsDown,
  FaReply,
  FaPaperPlane,
  FaChevronDown,
  FaChevronUp,
  FaUser,
  FaImage,
  FaSmile,
  FaTimes,
} from "react-icons/fa";
import { format } from "date-fns";

const API_BASE_URL = "http://localhost:5000";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "backOut",
    },
  },
};

const staggerChildren = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const pulseAnimation = {
  scale: [1, 1.1, 1],
  transition: {
    duration: 0.3,
  },
};

export default function ReviewCard({ review }) {
  const {
    reviewer,
    reviewer_logo,
    review: text,
    rating,
    created_at,
    images,
    id,
  } = review;
  const token = localStorage.getItem("authToken");
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [replies, setReplies] = useState([]);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showReplies, setShowReplies] = useState(false);
  const [userReaction, setUserReaction] = useState(null); // 'like' or 'dislike'
  const [isLoading, setIsLoading] = useState(false);
  const [isReacting, setIsReacting] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch reactions (counts + user reaction)
  useEffect(() => {
    let isMounted = true;
  
    const fetchReactions = async () => {
      try {
        const headers = {};
        if (token) headers.Authorization = `Bearer ${token}`;
  
        const res = await fetch(
          `${API_BASE_URL}/api/user/review/${id}/reactions`,
          { headers }
        );
  
        if (!res.ok) throw new Error("Failed to fetch reactions");
  
        const data = await res.json();
        if (!isMounted) return;
  
        setLikes(data.likes);
        setDislikes(data.dislikes);
        setUserReaction(data.userReaction);
      } catch (err) {
        console.error(err);
      }
    };
  
    fetchReactions();
    return () => (isMounted = false);
  }, [id, token]);



  const handleReact = async (type) => {
    if (!token) {
      alert("You must be logged in to react!");
      return;
    }
  
    if (isReacting) return;
    setIsReacting(true);
  
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/user/review/${id}/react`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ type }),
        }
      );
  
      if (!res.ok) throw new Error("Failed to react");
  
      const data = await res.json();
  
      // ✅ Server decides EVERYTHING
      setLikes(data.likes);
      setDislikes(data.dislikes);
      setUserReaction(data.userReaction);
  
    } catch (err) {
      console.error("Reaction failed", err);
    } finally {
      setIsReacting(false);
    }
  };
  
  

  const handleAddReply = async () => {
    if (!token) {
      alert("You must be logged in to reply!");
      return;
    }

    if (!replyText.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/user/review/${id}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: replyText }),
      });

      if (res.ok) {
        const newReply = await res.json();
        setReplies((prev) => [...prev, newReply]);
        setReplyText("");
        setShowReplyInput(false);
      }
    } catch (err) {
      console.error("Failed to add reply", err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStars = (count) => {
    return Array.from({ length: 5 }, (_, i) => (
      <motion.span
        key={i}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: i * 0.1 }}
      >
        <FaStar className={i < count ? "text-amber-500" : "text-gray-300"} />
      </motion.span>
    ));
  };

  const openImageModal = (image) => {
    setSelectedImage(image);
    setImageModalOpen(true);
  };

  return (
    <>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="border border-gray-200 rounded-3xl p-6 bg-linear-to-br from-white to-gray-50/50 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
      >
        {/* Reviewer Info */}
        <div className="flex items-center gap-4 mb-5">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <div className="w-14 h-14 rounded-full ">
              <img
                src={`http://localhost:5000/uploads/avatars/${reviewer_logo}`}
                alt={reviewer}
                className="w-full h-full object-cover rounded-full border-2 border-white shadow-md"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop";
                }}
              />
            </div>
          </motion.div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-900 text-lg">{reviewer}</h4>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <span>•</span>
              <span>{format(new Date(created_at), "MMM dd, yyyy")}</span>
            </p>
          </div>
        </div>

        {/* Rating Stars */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 mb-5"
        >
          <div className="flex gap-1 text-xl">{renderStars(rating)}</div>
        </motion.div>

        {/* Review Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-800 mb-6 leading-relaxed text-lg border-l-4 border-blue-300 pl-4 py-2 bg-blue-50/30 rounded-r-lg"
        >
          "{text}"
        </motion.p>

        {/* Image Gallery */}
        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FaImage className="text-blue-500" />
              Photos from this review ({images.length})
            </h5>
            <div className="flex gap-3 flex-wrap">
              {images.slice(0, 3).map((img, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05, rotate: 1 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative group cursor-pointer"
                  onClick={() => openImageModal(img)}
                >
                  <img
                    src={`http://localhost:5000/uploads/reviews/${img}`}
                    alt={`Review ${idx + 1}`}
                    className="w-28 h-28 object-cover rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-300"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1587131780296-88b6fe3e1d8c?w=400&h=400&fit=crop";
                    }}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {idx === 2 && images.length > 3 && (
                    <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        +{images.length - 3}
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          variants={staggerChildren}
          className="flex items-center gap-4 mt-6 pt-6 border-t border-gray-200"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleReact("like")}
            disabled={isReacting}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
              userReaction === "like"
                ? "bg-linear-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <motion.span
              animate={userReaction === "like" ? pulseAnimation : {}}
            >
              <FaThumbsUp />
            </motion.span>
            <span className="font-semibold">{likes}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleReact("dislike")}
            disabled={isReacting}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
              userReaction === "dislike"
                ? "bg-linear-to-r from-red-500 to-pink-500 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <motion.span
              animate={userReaction === "dislike" ? pulseAnimation : {}}
            >
              <FaThumbsDown />
            </motion.span>
            <span className="font-semibold">{dislikes}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowReplyInput(!showReplyInput)}
            className="ml-auto flex items-center gap-2 px-4 py-2 bg-linear-to-r from-emerald-500 to-emerald-600 text-white rounded-full hover:from-emerald-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all"
          >
            <FaReply />
            Reply
          </motion.button>
        </motion.div>

        {/* Reply Input */}
        <AnimatePresence>
          {showReplyInput && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 overflow-hidden"
            >
              <div className="bg-linear-to-r from-blue-50/50 to-purple-50/50 p-4 rounded-2xl border border-blue-200">
                <div className="flex gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-linear-to-r from-emerald-400 to-emerald-500 p-0.5">
                    <img
                      src="https://randomuser.me/api/portraits/lego/1.jpg"
                      alt="You"
                      className="w-full h-full rounded-full object-cover border-2 border-white"
                    />
                  </div>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write your reply here..."
                    className="flex-1 border-2 border-gray-200 rounded-xl p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
                    rows="2"
                  />
                </div>
                <div className="flex justify-between items-center">

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddReply}
                    disabled={isLoading || !replyText.trim()}
                    className="px-5 py-2 bg-linear-to-r from-emerald-600 to-emerald-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane />
                        Send Reply
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Replies Section */}
        {replies.length > 0 && (
          <motion.div className="mt-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center justify-between w-full p-3 bg-linear-to-r from-gray-50 to-gray-100/50 rounded-xl hover:from-gray-100 hover:to-gray-200/50 transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-700">
                  {replies.length} {replies.length === 1 ? "Reply" : "Replies"}
                </span>
              </div>
              {showReplies ? (
                <FaChevronUp className="text-gray-500" />
              ) : (
                <FaChevronDown className="text-gray-500" />
              )}
            </motion.button>

            <AnimatePresence>
              {showReplies && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 space-y-4 overflow-hidden"
                >
                  {replies.map((r, idx) => (
                    <motion.div
                      key={r.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex gap-3 p-4 bg-linear-to-r from-white to-gray-50/30 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-linear-to-r from-green-400 to-blue-500 p-0.5">
                        <img
                          src={`http://localhost:5000/uploads/avatars/${r.avatar}`}
                          alt={r.user}
                          className="w-full h-full rounded-full object-cover border-2 border-white"
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop";
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-semibold text-gray-900">
                            {r.user}
                          </p>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">
                            {format(new Date(r.created_at), "MMM dd, h:mm a")}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 bg-linear-to-r from-gray-50 to-white p-3 rounded-lg">
                          {r.text}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.div>

      {/* Image Modal */}
      <AnimatePresence>
        {imageModalOpen && selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setImageModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={`http://localhost:5000/uploads/reviews/${selectedImage}`}
                alt="Review"
                className="w-full h-full object-contain rounded-2xl shadow-2xl"
              />
              <motion.button
                whileHover={{ scale: 1.2, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setImageModalOpen(false)}
                className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                <FaTimes className="text-xl" />
              </motion.button>
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <span className="bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                  Review by {reviewer}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
