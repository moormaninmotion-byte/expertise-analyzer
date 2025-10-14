import React from 'react';
import { Workbook } from '../types';
import { ProblemCard } from './ProblemCard';

interface WorkbookDisplayProps {
  workbook: Workbook;
}

export const WorkbookDisplay: React.FC<WorkbookDisplayProps> = ({ workbook }) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
          Expertise Workbook: <span className="text-indigo-600 dark:text-indigo-400">{workbook.topic}</span>
        </h2>
        <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
          Challenge yourself with these problems, ranked from beginner to expert.
        </p>
      </div>
      <div className="space-y-6">
        {workbook.problems.map((problem) => (
          <ProblemCard key={problem.level} problem={problem} topic={workbook.topic} />
        ))}
      </div>
    </div>
  );
};
