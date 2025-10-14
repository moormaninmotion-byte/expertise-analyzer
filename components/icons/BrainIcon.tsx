
import React from 'react';

export const BrainIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v1.2a1 1 0 0 0 .94.99c.63.05 1.18.42 1.56.9.38.48.5 1.1.28 1.72l-1.38 3.12a1 1 0 0 0 .1 1.1l1.38 1.38a1 1 0 0 0 1.54-.3l.27-.68a1.5 1.5 0 0 1 1.84-1.03c.8.17 1.43.8 1.57 1.6.14.8-.2 1.58-.88 2.06-1.4.98-2.2 2.6-2.2 4.34V22" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v1.2a1 1 0 0 1-.94.99c-.63.05-1.18.42-1.56.9-.38.48-.5 1.1-.28 1.72l1.38 3.12a1 1 0 0 1-.1 1.1L9.14 15a1 1 0 0 1-1.54-.3l-.27-.68a1.5 1.5 0 0 0-1.84-1.03c-.8.17-1.43.8-1.57 1.6-.14.8.2 1.58.88 2.06 1.4.98 2.2 2.6 2.2 4.34V22" />
  </svg>
);
