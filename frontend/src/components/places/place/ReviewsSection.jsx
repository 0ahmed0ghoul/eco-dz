import React, { useState, useEffect, useCallback } from 'react';
import ReviewCard from './ReviewCard';
import AddReviewForm from './AddReviewForm';

const API_BASE_URL = 'http://localhost:5000';

export default function ReviewsSection({ placeId }) {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  const fetchReviews = useCallback(async () => {
    if (!placeId) return;

    setIsLoading(true);
    setFetchError('');

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/places/${placeId}/reviews`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch reviews: ${response.status}`);
      }
      
      const data = await response.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setFetchError('Unable to load reviews. Please try again later.');
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  }, [placeId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleReviewAdded = useCallback((newReview) => {
    setReviews(prev => [newReview, ...prev]);
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center py-8">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-2 text-sm text-gray-500">Loading reviews...</p>
          </div>
        </div>
      );
    }

    if (fetchError) {
      return (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-600">{fetchError}</p>
          <button
            onClick={fetchReviews}
            className="mt-2 text-sm font-medium text-red-700 hover:text-red-800"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (reviews.length === 0) {
      return (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
          <p className="text-sm text-gray-600">No reviews yet. Be the first to share your experience!</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    );
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-8 md:px-6">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Customer Reviews
        </h2>
        {reviews.length > 0 && (
          <p className="mt-1 text-sm text-gray-600">
            {reviews.length} review{reviews.length !== 1 ? 's' : ''}
          </p>
        )}
      </header>

      <div className="mb-8">
        <AddReviewForm 
          placeId={placeId} 
          onReviewAdded={handleReviewAdded} 
        />
      </div>

      <div className="mt-8">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          What Others Are Saying
        </h3>
        {renderContent()}
      </div>
    </section>
  );
}