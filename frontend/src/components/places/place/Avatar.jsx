import React from 'react';

const SIZE_CLASSES = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base'
};

const getInitials = (name) => {
  if (!name.trim()) return '—';
  
  return name
    .split(' ')
    .map(part => part[0]?.toUpperCase())
    .filter(Boolean)
    .slice(0, 2)
    .join('');
};

export default function Avatar({ name, size = 'md' }) {
  const initials = getInitials(name);

  return (
    <div 
      className={`
        ${SIZE_CLASSES[size]}
        flex items-center justify-center 
        rounded-full bg-gradient-to-br from-gray-100 to-gray-200 
        font-semibold text-gray-700 shadow-sm
        border border-gray-300/50
      `}
      aria-label={`Avatar for ${name}`}
    >
      {initials}
    </div>
  );
}