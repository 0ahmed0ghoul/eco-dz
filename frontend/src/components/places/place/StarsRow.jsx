import React from 'react';

const SIZE_CLASSES = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6'
};

const StarIcon = ({ filled, size = 'md' }) => (
  <svg
    aria-hidden="true"
    className={`${SIZE_CLASSES[size]} ${filled ? 'text-yellow-500 fill-current' : 'text-gray-300 fill-none'} transition-colors duration-200`}
    stroke={filled ? 'currentColor' : '#D1D5DB'}
    strokeWidth="1"
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.29a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.037a1 1 0 00-.364 1.118l1.07 3.29c.3.921-.755 1.688-1.54 1.118l-2.802-2.037a1 1 0 00-1.176 0l-2.802 2.037c-.784.57-1.838-.197-1.539-1.118l1.07-3.29a1 1 0 00-.364-1.118L2.88 8.717c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.29z" />
  </svg>
);

export default function StarsRow({ rating, maxRating = 5, showRating = true }) {
  const normalizedRating = Math.min(Math.max(rating, 0), maxRating);
  const fullStars = Math.floor(normalizedRating);
  const hasHalfStar = normalizedRating % 1 >= 0.5;

  const renderStars = () => {
    return Array.from({ length: maxRating }).map((_, index) => {
      const filled = index < fullStars || (hasHalfStar && index === fullStars);
      return <StarIcon key={index} filled={filled} size="md" />;
    });
  };

  return (
    <div 
      className="flex items-center gap-1" 
      role="img" 
      aria-label={`${normalizedRating.toFixed(1)} out of ${maxRating} stars`}
    >
      {renderStars()}
      {showRating && (
        <span className="ml-2 text-sm font-medium text-gray-700">
          {normalizedRating.toFixed(1)}
        </span>
      )}
    </div>
  );
}