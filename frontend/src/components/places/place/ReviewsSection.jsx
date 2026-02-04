import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReviewCard from './ReviewCard';
import AddReviewForm from './AddReviewForm';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {
  FaStar,
  FaComment,
  FaSort,
  FaFilter,
  FaChevronDown,
  FaChevronUp,
  FaSync,
  FaExclamationTriangle,
  FaSadTear,
  FaRocket
} from 'react-icons/fa';

const API_BASE_URL = 'http://localhost:5000';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 0.6,
    repeat: Infinity,
    repeatType: "reverse"
  }
};

export default function ReviewsSection({ placeId }) {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [showFilters, setShowFilters] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  const role = localStorage.getItem('role');
  const token = localStorage.getItem('authToken');

  // Calculate statistics from reviews
  const calculateStats = useCallback((reviewsData) => {
    if (!reviewsData.length) {
      setAverageRating(0);
      setRatingDistribution({});
      return;
    }

    const total = reviewsData.reduce((sum, review) => sum + review.rating, 0);
    const avg = total / reviewsData.length;
    setAverageRating(avg.toFixed(1));

    // Calculate distribution
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviewsData.forEach(review => {
      distribution[review.rating]++;
    });
    setRatingDistribution(distribution);
  }, []);

  // Sort reviews based on selected option
  const sortReviews = useCallback((reviewsList, sortMethod) => {
    const sorted = [...reviewsList];
    switch (sortMethod) {
      case 'highest':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'lowest':
        return sorted.sort((a, b) => a.rating - b.rating);
      case 'mostLiked':
        return sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0));
      case 'recent':
      default:
        return sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
  }, []);

  // Fetch reviews from backend
  const fetchReviews = useCallback(async () => {
    if (!placeId) return;

    setRefreshing(true);
    setIsLoading(true);
    setFetchError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/places/${placeId}/reviews`);
      if (!response.ok) throw new Error(`Failed to fetch reviews: ${response.status}`);
      const data = await response.json();

      // ✅ Ensure images is always an array
      const formatted = data.map((r) => ({
        ...r,
        images: Array.isArray(r.images) ? r.images : [],
      }));

      const sortedReviews = sortReviews(formatted, sortBy);
      setReviews(sortedReviews);
      calculateStats(sortedReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setFetchError('Unable to load reviews. Please try again later.');
      setReviews([]);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [placeId, sortBy, sortReviews, calculateStats]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Callback when a new review is added
  const handleReviewAdded = useCallback((newReview) => {
    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    calculateStats(updatedReviews);
    toast.success('Review added successfully!');
  }, [reviews, calculateStats]);

  // Handle sort change
  const handleSortChange = (method) => {
    setSortBy(method);
    const sorted = sortReviews(reviews, method);
    setReviews(sorted);
  };

  // Render rating distribution bar
  const renderRatingBar = (stars, count) => {
    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
    return (
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 text-sm font-medium text-amber-700">{stars} ★</div>
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-linear-to-r from-amber-400 to-amber-500 rounded-full"
          />
        </div>
        <div className="w-12 text-right text-sm text-gray-600">{count}</div>
      </div>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16"
        >
          <motion.div
            animate={pulseAnimation}
            className="relative"
          >
            <div className="w-24 h-24 bg-linear-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center shadow-lg">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-solid border-blue-600 border-r-transparent"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FaComment className="text-2xl text-blue-600" />
            </div>
          </motion.div>
          <p className="mt-6 text-lg font-medium text-gray-700">Loading reviews...</p>
          <p className="text-sm text-gray-500 mt-2">Gathering experiences from fellow travelers</p>
        </motion.div>
      );
    }

    if (fetchError) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-red-200 bg-linear-to-r from-red-50 to-pink-50 p-8 shadow-lg"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <FaExclamationTriangle className="text-2xl text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Oops! Something went wrong</h3>
            <p className="text-gray-600 mb-6 max-w-md">{fetchError}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchReviews}
              className="px-6 py-3 bg-linear-to-r from-red-500 to-pink-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <FaSync />
              Try Again
            </motion.button>
          </div>
        </motion.div>
      );
    }

    if (reviews.length === 0) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          id='review'
          className="rounded-2xl border-2 border-dashed border-gray-300 bg-linear-to-br from-blue-50/30 to-purple-50/30 p-10 text-center shadow-inner"
        >
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-20 h-20 bg-linear-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6 shadow-inner"
            >
              <FaSadTear className="text-3xl text-blue-600" />
            </motion.div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">No reviews yet</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              Be the first to share your experience and help other travelers discover this amazing place!
            </p>
            <div className="text-xs text-gray-500 bg-white/50 px-4 py-2 rounded-full">
              ✨ Your review could make someone's trip special
            </div>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        variants={staggerChildren}
        initial="hidden"
        animate="visible"
        className="space-y-6"
        id='review'
      >
        {reviews.map((review, index) => (
          <motion.div
            key={review.id}
            variants={fadeInUp}
            custom={index}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.1 }}
          >
            <ReviewCard review={review} />
          </motion.div>
        ))}
      </motion.div>
    );
  };

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      className="mx-auto max-w-5xl px-4 py-12 md:px-6"
    >
      {/* Header Section */}
      <header className="mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 bg-linear-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
              Traveler Reviews
            </h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-2 text-gray-600 flex items-center gap-2"
            >
              <FaComment className="text-blue-500" />
              Real experiences shared by travelers like you
            </motion.p>
          </div>

          {reviews.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchReviews}
                disabled={refreshing}
                className="px-4 py-2 bg-linear-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <FaSync className={`${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </motion.button>
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                >
                  <FaSort />
                  Sort By
                  {showFilters ? <FaChevronUp /> : <FaChevronDown />}
                </motion.button>
                
                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-10"
                    >
                      {[
                        { value: 'recent', label: 'Most Recent' },
                        { value: 'highest', label: 'Highest Rated' },
                        { value: 'lowest', label: 'Lowest Rated' },
                        { value: 'mostLiked', label: 'Most Liked' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            handleSortChange(option.value);
                            setShowFilters(false);
                          }}
                          className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors ${
                            sortBy === option.value 
                              ? 'bg-blue-50 text-blue-600 font-medium' 
                              : 'text-gray-700'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </div>

        {/* Rating Statistics */}
        {reviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-linear-to-r from-blue-50/30 to-purple-50/30 rounded-2xl p-6 border border-blue-100/50 shadow-sm"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-5xl font-bold text-gray-900">
                    {averageRating}
                  </div>
                  <div>
                    <div className="flex gap-1 text-2xl">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={star <= averageRating ? "text-amber-500" : "text-gray-300"}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-green-600">Excellent</span> • Travelers' Choice
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-4">Rating Distribution</h4>
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((stars) => 
                    renderRatingBar(stars, ratingDistribution[stars] || 0)
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </header>

      {/* Add Review Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-10"
      >
        <AddReviewForm
          placeId={placeId}
          isTraveller={role === 'traveller'}
          onReviewAdded={handleReviewAdded}
        />
      </motion.div>

      {/* Reviews List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-10"
      >
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <span className="bg-linear-to-r from-emerald-500 to-emerald-700 text-white px-3 py-1 rounded-full">
              {reviews.length}
            </span>
            Traveler Experiences
          </h3>
          
          {reviews.length > 0 && (
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Live updates • Real feedback
            </div>
          )}
        </div>
        
        {renderContent()}
        
        {reviews.length > 5 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 pt-8 border-t border-gray-200 text-center"
          >
            <p className="text-gray-600 mb-4">Showing {Math.min(reviews.length, 5)} of {reviews.length} reviews</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
            >
              Load More Reviews
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </motion.section>
  );
}