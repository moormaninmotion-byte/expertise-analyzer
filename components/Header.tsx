
import React from 'react';
import { BrainIcon } from './icons/BrainIcon';

export const Header: React.FC = () => {
  return (
    <header className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg sticky top-0 z-10 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <BrainIcon className="h-8 w-8 text-indigo-500" />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">
              Expertise Analyzer
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};
