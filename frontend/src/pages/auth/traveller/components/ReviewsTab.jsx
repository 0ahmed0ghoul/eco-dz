// ReviewsTab.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaComment,
  FaMapMarkerAlt,
  FaTrash,
  FaEdit,
  FaStar,
  FaCamera,
  FaTimes,
  FaCheck,
  FaPaperPlane,
  FaImages,
} from "react-icons/fa";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" }
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2 }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.3, ease: "backOut" }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const ReviewsTab = ({ 
  reviews, 
  getPlaceInfo, 
  handleDeleteComment, 
  handleUpdateReview,
  renderStars,
  formatTravelDate,
  editingReview,
  setEditingReview,
  newImages,
  setNewImages,
  deleteImages,
  setDeleteImages,
  saving,
  setSaving
}) => {
  // These functions can be moved here if you want the component to be self-contained
  const handleSaveReview = async (reviewId) => {
    try {
      setSaving(true);
      await handleUpdateReview(reviewId, {
        deleteImages,
        newImages,
        review: editingReview.review,
        rating: editingReview.rating,
      });
    } catch (error) {
      console.error("Failed to update review:", error);
    } finally {
      setSaving(false);
    }
  };
  const handleEditReview = (review) => {
    setEditingReview({
      ...review,
      images: (review.images || []).map((img) => ({
        image: typeof img === "string" ? img : img.image,
      })),
    });
  
    setNewImages([]);
    setDeleteImages([]);
  };

  const cancelEdit = () => {
    setEditingReview(null);
    setNewImages([]);
    setDeleteImages([]);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={fadeIn}
      className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-100 bg-linear-to-r from-blue-50/50 to-purple-50/50">
        <motion.h3 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-bold text-gray-900"
        >
          My Reviews
        </motion.h3>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 mt-2 flex items-center gap-2"
        >
          <FaComment className="text-blue-500" />
          Reviews and feedback you've shared with the community
        </motion.p>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {reviews.length === 0 ? (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-20 h-20 bg-linear-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner"
              >
                <FaComment className="text-3xl text-blue-600" />
              </motion.div>
              <h4 className="text-xl font-semibold text-gray-800 mb-3">
                No reviews yet
              </h4>
              <p className="text-gray-500 max-w-md mx-auto mb-8">
                Share your experiences and help fellow travelers discover amazing places!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
                onClick={() => window.location.href = "/places"}
              >
                Explore Places to Review
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="reviews-list"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {reviews.map((c, index) => {
                const place = getPlaceInfo(c.place_id);
                const isEditing = editingReview?.id === c.id;

                return (
                  <motion.div
                    key={c.id}
                    variants={fadeIn}
                    layout
                    className="border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 bg-linear-to-br from-white to-gray-50/50"
                    whileHover={{ y: -2 }}
                  >
                    {/* Review Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <motion.div 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <h4 className="font-bold text-gray-900 text-lg">
                            {place.name}
                          </h4>
                          {place.address && (
                            <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                              <FaMapMarkerAlt className="text-blue-500" />
                              {place.address}
                            </p>
                          )}
                        </motion.div>
                      </div>
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 + 0.1 }}
                        className="flex gap-2"
                      >
                        <motion.button
                          whileHover={{ scale: 1.1, backgroundColor: "#fef2f2" }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteComment(c.id)}
                          className="text-gray-400 hover:text-red-500 p-2.5 hover:bg-red-50 rounded-xl transition-colors"
                          title="Delete review"
                        >
                          <FaTrash />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1, backgroundColor: "#eff6ff" }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEditReview(c)}
                          className="text-blue-500 hover:text-blue-700 p-2.5 hover:bg-blue-50 rounded-xl transition-colors"
                          title="Edit review"
                        >
                          <FaEdit />
                        </motion.button>
                      </motion.div>
                    </div>

                    {/* Image Gallery */}
                    {!isEditing && c.images?.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-3 flex-wrap mb-4"
                      >
                        {c.images.map((img, imgIndex) => {
                          const filename = typeof img === "string" ? img : img.image;
                          return (
                            <motion.div
                              key={imgIndex}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: imgIndex * 0.1 }}
                              whileHover={{ scale: 1.05 }}
                              className="relative group"
                            >
                              <img
                                src={`http://localhost:5000/uploads/reviews/${filename}`}
                                alt="Review"
                                className="w-24 h-24 object-cover rounded-xl shadow-md group-hover:shadow-lg transition-all"
                                onError={(e) => {
                                  e.target.src = "https://images.unsplash.com/photo-1587131780296-88b6fe3e1d8c?w=400&h=400&fit=crop";
                                }}
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-xl transition-all duration-300" />
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    )}

                    {/* Review Content */}
                    <AnimatePresence mode="wait">
                      {!isEditing ? (
                        <motion.div
                          key={`review-${c.id}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="space-y-4"
                        >
                          {/* Review Text */}
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="p-4 bg-linear-to-r from-blue-50/30 to-purple-50/30 rounded-xl border border-blue-100/50"
                          >
                            <p className="text-gray-800 leading-relaxed">{c.review}</p>
                          </motion.div>

                          {/* Rating and Date */}
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center justify-between pt-2"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2 bg-linear-to-r from-amber-50 to-amber-100 px-3 py-1.5 rounded-full border border-amber-200">
                                <div className="flex gap-1">
                                  {renderStars(c.rating || 0)}
                                </div>
                                <span className="font-bold text-amber-700">
                                  {c.rating || 0}<span className="text-amber-600">/5</span>
                                </span>
                              </div>
                              <span className="text-sm font-medium text-gray-700">
                                Your Experience
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                              {formatTravelDate(c.created_at)}
                            </div>
                          </motion.div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key={`edit-${c.id}`}
                          variants={scaleIn}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          className="mt-4 space-y-6 border-t pt-6"
                        >
                          {/* Edit Review Text */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Review Text
                            </label>
                            <textarea
                              value={editingReview.review}
                              onChange={(e) =>
                                setEditingReview({
                                  ...editingReview,
                                  review: e.target.value,
                                })
                              }
                              className="w-full border-2 border-gray-200 rounded-xl p-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300"
                              rows={4}
                              placeholder="Share your detailed experience..."
                            />
                          </div>

                          {/* Edit Rating */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                              Rating
                            </label>
                            <div className="flex items-center gap-6">
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <motion.button
                                    key={star}
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                    type="button"
                                    onClick={() =>
                                      setEditingReview({
                                        ...editingReview,
                                        rating: star,
                                      })
                                    }
                                    className={`text-2xl ${
                                      star <= editingReview.rating
                                        ? "text-amber-500"
                                        : "text-gray-300"
                                    }`}
                                  >
                                    <FaStar />
                                  </motion.button>
                                ))}
                              </div>
                              <span className="text-lg font-bold text-gray-800">
                                {editingReview.rating}<span className="text-gray-500">/5</span>
                              </span>
                            </div>
                          </div>

                          {/* Current Images */}
                          {editingReview.images?.length > 0 && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-3">
                                Current Images
                              </label>
                              <div className="flex gap-3 flex-wrap">
                                {editingReview.images.map((img) => {
                                  if (deleteImages.includes(img.image)) return null;
                                  return (
                                    <motion.div
                                      key={img.id}
                                      layout
                                      initial={{ opacity: 0, scale: 0.8 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.8 }}
                                      className="relative group"
                                    >
                                      <img
                                        src={`http://localhost:5000/uploads/reviews/${img.image}`}
                                        className="w-24 h-24 object-cover rounded-xl shadow-lg"
                                        alt="Review"
                                      />
                                      <motion.button
                                        whileHover={{ scale: 1.2 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => {
                                          setDeleteImages((prev) =>
                                            prev.includes(img.image)
                                              ? prev
                                              : [...prev, img.image]
                                          );
                                        }}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600 transition-colors"
                                        title="Remove image"
                                      >
                                        <FaTimes size={12} />
                                      </motion.button>
                                    </motion.div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* New Images Preview */}
                          {newImages.length > 0 && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-3">
                                New Images
                              </label>
                              <div className="flex gap-3 flex-wrap">
                                {Array.from(newImages).map((file, index) => (
                                  <motion.div
                                    key={index}
                                    layout
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="relative group"
                                  >
                                    <img
                                      src={URL.createObjectURL(file)}
                                      alt="New preview"
                                      className="w-24 h-24 object-cover rounded-xl shadow-lg"
                                    />
                                    <motion.button
                                      whileHover={{ scale: 1.2 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() =>
                                        setNewImages((prev) =>
                                          prev.filter((_, i) => i !== index)
                                        )
                                      }
                                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600 transition-colors"
                                      title="Remove image"
                                    >
                                      <FaTimes size={12} />
                                    </motion.button>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Add New Images */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                              Add More Images
                            </label>
                            <motion.label
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-gray-50/50 hover:bg-gray-100/50 transition-colors group"
                            >
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) =>
                                  setNewImages([...e.target.files])
                                }
                                className="hidden"
                              />
                              <FaImages className="text-3xl text-gray-400 group-hover:text-blue-500 mb-2 transition-colors" />
                              <span className="text-gray-500 group-hover:text-gray-700">
                                Click to add images
                              </span>
                              <span className="text-xs text-gray-400 mt-1">
                                PNG, JPG, GIF up to 5MB
                              </span>
                            </motion.label>
                          </div>

                          {/* Action Buttons */}
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-3 justify-end pt-4 border-t"
                          >
                            <motion.button
                              whileHover={{ scale: 1.05, backgroundColor: "#f3f4f6" }}
                              whileTap={{ scale: 0.95 }}
                              onClick={cancelEdit}
                              className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                            >
                              Cancel
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleSaveReview(c.id)}
                              disabled={saving}
                              className="px-5 py-2.5 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                              {saving ? (
                                <>
                                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <FaPaperPlane />
                                  Save Changes
                                </>
                              )}
                            </motion.button>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ReviewsTab;