import React from 'react';

export const ThumbsUpIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M7 10v12" />
    <path d="M18 10h-5.5L14 4.5 12.5 2l-3 3.5-2 7.5V22h13.5c.8 0 1.5-.7 1.5-1.5v-7c0-.8-.7-1.5-1.5-1.5z" />
  </svg>
);
