import React, { useState } from 'react';
import { Problem } from '../types';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { analyzeAnswer } from '../services/geminiService';


interface ProblemCardProps {
  problem: Problem;
  topic: string;
}

const levelColorClasses = [
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
];

export const ProblemCard: React.FC<ProblemCardProps> = ({ problem, topic }) => {
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  
  const badgeColor = levelColorClasses[problem.level - 1] || levelColorClasses[0];

  const handleSubmitAnswer = async () => {
    setIsAnalyzing(true);
    setAnalysis(null);
    setAnalysisError(null);
    try {
      const result = await analyzeAnswer(topic, problem.question, problem.solution, userAnswer);
      setAnalysis(result);
    } catch (err: any) {
      setAnalysisError(err.message || 'Failed to get analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${badgeColor}`}>
            Level {problem.level}
          </span>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white text-right">{problem.title}</h3>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-4 italic">
          {problem.description}
        </p>

        <p className="text-gray-800 dark:text-gray-200 mb-4 font-medium text-lg">
          {problem.question}
        </p>

        <textarea
          rows={4}
          className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
          placeholder="Use this space to work out your answer..."
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
        ></textarea>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            <LightbulbIcon className="w-4 h-4" />
            {showHint ? 'Hide Hint' : 'Show Hint'}
          </button>
          <button
            onClick={() => setShowSolution(!showSolution)}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
          >
            {showSolution ? 'Hide Solution' : 'Show Solution'}
          </button>
          <button
            onClick={handleSubmitAnswer}
            disabled={!userAnswer.trim() || isAnalyzing}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition disabled:bg-green-300 dark:disabled:bg-green-800 disabled:cursor-not-allowed"
          >
            <SparklesIcon className="w-4 h-4" />
            {isAnalyzing ? 'Analyzing...' : 'Get Expert Analysis'}
          </button>
        </div>

        <div className="mt-4 min-h-[24px]">
            {isAnalyzing && (
                <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">Please wait while our expert reviews your answer...</p>
            )}
            {analysisError && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-md" role="alert">
                <p className="font-bold">Analysis Error</p>
                <p>{analysisError}</p>
              </div>
            )}
            {analysis && (
                <div className="p-4 mt-2 bg-indigo-50 dark:bg-gray-700/50 rounded-lg border border-indigo-200 dark:border-gray-600">
                    <h4 className="flex items-center gap-2 font-semibold text-indigo-800 dark:text-indigo-300">
                        <SparklesIcon className="w-5 h-5" />
                        Expert Analysis
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 mt-2 whitespace-pre-wrap">{analysis}</p>
                </div>
            )}
        </div>
      </div>
        
      {showHint && (
        <div className="px-6 py-4 bg-yellow-50 dark:bg-gray-800 border-t border-yellow-200 dark:border-gray-700">
          <h4 className="font-semibold text-yellow-800 dark:text-yellow-300">Hint</h4>
          <p className="text-yellow-700 dark:text-yellow-200 mt-1">{problem.hint}</p>
        </div>
      )}

      {showSolution && (
        <div className="px-6 py-4 bg-green-50 dark:bg-gray-900 border-t border-green-200 dark:border-gray-700">
          <h4 className="font-semibold text-green-800 dark:text-green-300">Solution</h4>
          <p className="text-green-700 dark:text-green-200 mt-1 whitespace-pre-wrap">{problem.solution}</p>
        </div>
      )}
    </div>
  );
};
