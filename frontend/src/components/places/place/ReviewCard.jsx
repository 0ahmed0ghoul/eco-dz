import React from 'react';
import Avatar from './Avatar';
import StarsRow from './StarsRow';

export default function ReviewCard({ review }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <article 
      className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md"
      aria-labelledby={`review-${review.id}`}
    >
      <div className="flex items-start gap-4">
        <Avatar name={review.reviewer} />
        
        <div className="flex-1 space-y-3">
          {/* Header with metadata */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h3 
              id={`review-${review.id}`}
              className="text-sm font-semibold text-gray-900"
            >
              {review.reviewer}
            </h3>
            <span className="text-xs text-gray-400">•</span>
            <time 
              dateTime={review.created_at}
              className="text-xs text-gray-500"
            >
              {formatDate(review.created_at)}
            </time>
          </div>

          {/* Rating */}
          <StarsRow rating={review.rating} />

          {/* Review text */}
          <p className="text-sm text-gray-800 leading-relaxed">
            {review.review}
          </p>

          {/* Optional image */}
          {review.image && (
            <div className="pt-2">
              <img
                src={`http://localhost:5000${review.image}`}
                alt={`Review by ${review.reviewer}`}
                className="max-h-60 w-auto rounded-lg border border-gray-200 object-cover"
                loading="lazy"
              />
            </div>
          )}
        </div>
      </div>
    </article>
  );
}