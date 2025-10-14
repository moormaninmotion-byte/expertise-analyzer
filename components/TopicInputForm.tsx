
import React, { useState } from 'react';

interface TopicInputFormProps {
  onSubmit: (topic: string) => void;
  isLoading: boolean;
}

export const TopicInputForm: React.FC<TopicInputFormProps> = ({ onSubmit, isLoading }) => {
  const [topic, setTopic] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (topic.trim() && !isLoading) {
      onSubmit(topic.trim());
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Enter a Topic</h2>
      <p className="text-gray-600 dark:text-gray-300">
        What subject would you like to test your expertise on? Provide a topic like "React Hooks", "Photosynthesis", or "The Roman Empire".
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., Quantum Mechanics"
          className="flex-grow w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="px-6 py-3 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 dark:disabled:bg-indigo-800 disabled:cursor-not-allowed transition-colors duration-200"
          disabled={isLoading || !topic.trim()}
        >
          {isLoading ? 'Generating...' : 'Create Workbook'}
        </button>
      </form>
    </div>
  );
};
