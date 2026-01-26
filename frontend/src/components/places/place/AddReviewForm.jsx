import React, { useState, useCallback } from 'react';
import StarsRow from './StarsRow';

const API_BASE_URL = 'http://localhost:5000';

export default function AddReviewForm({ placeId, onReviewAdded }) {
  const [formData, setFormData] = useState({
    review: '',
    rating: 5,
    image: null
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const authToken = localStorage.getItem('authToken');
  const role = localStorage.getItem('role');
  const canReview = authToken && role === 'traveller';

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleImageChange = useCallback((event) => {
    const file = event.target.files?.[0] || null;
    
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
    }

    handleInputChange('image', file);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
    setError('');
  }, [handleInputChange]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!canReview || isSubmitting) return;
    
    setError('');
    setIsSubmitting(true);

    const submitData = new FormData();
    submitData.append('review', formData.review);
    submitData.append('rating', formData.rating.toString());
    if (formData.image) {
      submitData.append('image', formData.image);
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/places/${placeId}/reviews`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
          body: submitData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit review');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit review');
      }
      
      // 🔹 build the local review object
      const newReview = {
          review: formData.review,
          rating: formData.rating,
          images: Array.isArray(data.images) ? data.images : [],
          created_at: data.created_at || new Date().toISOString(),
        };
    
      // 🔹 send it to ReviewsSection state
      onReviewAdded?.(newReview);

      // Reset form
      setFormData({ review: '', rating: 5, image: null });
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!canReview) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
        <p className="text-sm text-gray-600">
          Please log in as a traveller to add a review.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        Share Your Experience
      </h3>

      {/* Rating Input */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Your Rating
        </label>
        <div className="flex items-center gap-4">
          <select
            value={formData.rating}
            onChange={(e) => handleInputChange('rating', Number(e.target.value))}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            aria-label="Select rating"
          >
            {[5, 4, 3, 2, 1].map((rating) => (
              <option key={rating} value={rating}>
                {rating} Star{rating > 1 ? 's' : ''}
              </option>
            ))}
          </select>
          <StarsRow rating={formData.rating} />
        </div>
      </div>

      {/* Review Text */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Your Review
        </label>
        <textarea
          value={formData.review}
          onChange={(e) => handleInputChange('review', e.target.value)}
          required
          rows="4"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
          placeholder="Share your thoughts about this place..."
          aria-label="Review text"
        />
      </div>

      {/* Image Upload */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Add Photo (Optional)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
          aria-label="Upload review image"
        />
        {previewUrl && (
          <div className="mt-3">
            <p className="mb-2 text-xs text-gray-500">Image Preview:</p>
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-48 rounded-lg border border-gray-200 object-cover"
            />
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}