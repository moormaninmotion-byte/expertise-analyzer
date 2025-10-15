// Fix: Creating the ProblemCard component to display individual problems.
import React, { useState, useEffect, useRef } from 'react';
import { Problem } from '../types';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { analyzeAnswer } from '../services/geminiService';

interface ProblemCardProps {
  problem: Problem;
  topic: string;
}

const levelConfig = {
  Beginner: {
    icon: <BriefcaseIcon className="h-6 w-6 text-green-500" />,
    bgColor: 'bg-green-50 dark:bg-green-900/50',
    borderColor: 'border-green-200 dark:border-green-700',
    textColor: 'text-green-800 dark:text-green-300',
  },
  Intermediate: {
    icon: <LightbulbIcon className="h-6 w-6 text-yellow-500" />,
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/50',
    borderColor: 'border-yellow-200 dark:border-yellow-700',
    textColor: 'text-yellow-800 dark:text-yellow-300',
  },
  Expert: {
    icon: <SparklesIcon className="h-6 w-6 text-red-500" />,
    bgColor: 'bg-red-50 dark:bg-red-900/50',
    borderColor: 'border-red-200 dark:border-red-700',
    textColor: 'text-red-800 dark:text-red-300',
  },
};

const funnyLoadingMessages = [
  "Rousing the expert from a deep slumber...",
  "Brewing a pot of philosophical coffee...",
  "Dusting off the ancient scrolls of knowledge...",
  "Consulting the council of wise old wizards...",
  "Recalibrating the pedantic-o-meter...",
  "Checking for logical fallacies... and typos.",
  "The expert is stroking their beard thoughtfully...",
  "Don't worry, they're a fast reader."
];

export const ProblemCard: React.FC<ProblemCardProps> = ({ problem, topic }) => {
  const [isSolutionVisible, setIsSolutionVisible] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState(funnyLoadingMessages[0]);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isAnalyzing) {
      let messageIndex = 0;
      intervalRef.current = window.setInterval(() => {
        messageIndex = (messageIndex + 1) % funnyLoadingMessages.length;
        setLoadingMessage(funnyLoadingMessages[messageIndex]);
      }, 2000); // Change message every 2 seconds
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAnalyzing]);

  const handleGetAnalysis = async () => {
    if (!userAnswer.trim()) return;

    setIsAnalyzing(true);
    setAnalysis(null);
    setAnalysisError(null);
    setLoadingMessage(funnyLoadingMessages[0]);

    try {
      const result = await analyzeAnswer(
        topic,
        problem.question,
        problem.solution,
        userAnswer
      );
      setAnalysis(result);
    } catch (err: any) {
      setAnalysisError(err.message || 'An unknown error occurred.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatAnalysis = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n\s*-\s/g, '<br>&bull; ')
      .replace(/\n\s*\*\s/g, '<br>&bull; ')
      .replace(/\n/g, '<br />');
  };

  // FIX: Define the 'config' variable by accessing the 'levelConfig' object with the current problem's level.
  const config = levelConfig[problem.level];

  return (
    <div className={`rounded-xl border ${config.borderColor} shadow-sm overflow-hidden`}>
      <div className={`p-4 sm:p-6 ${config.bgColor}`}>
        <div className="flex items-center gap-4">
          {config.icon}
          <h3 className={`text-xl font-bold ${config.textColor}`}>{problem.level} Level</h3>
        </div>
      </div>
      <div className="p-4 sm:p-6 bg-white dark:bg-gray-800">
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300 font-medium text-lg">{problem.question}</p>
          
          <div className="space-y-2">
            <label htmlFor={`answer-${problem.level}`} className="font-semibold text-gray-800 dark:text-white">Your Answer:</label>
            <textarea
              id={`answer-${problem.level}`}
              rows={5}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your detailed answer here..."
              className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              disabled={isAnalyzing}
              aria-label={`Your answer for the ${problem.level} level question`}
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={handleGetAnalysis}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300 dark:disabled:bg-green-800 disabled:cursor-not-allowed transition-colors"
              disabled={isAnalyzing || !userAnswer.trim()}
            >
              {isAnalyzing ? (
                'Analyzing...'
              ) : (
                <>
                  <SparklesIcon className="h-5 w-5" />
                  Get Expert Analysis
                </>
              )}
            </button>
            <button
              onClick={() => setIsSolutionVisible(!isSolutionVisible)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/50 rounded-md hover:bg-indigo-200 dark:hover:bg-indigo-900 transition-colors"
            >
              {isSolutionVisible ? 'Hide Solution' : 'Show Solution'}
            </button>
          </div>

          {isAnalyzing && (
            <div className="mt-4 flex items-center gap-3 text-gray-500 dark:text-gray-400">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <span>{loadingMessage}</span>
            </div>
          )}

          {analysisError && (
            <div className="mt-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
              <p className="font-bold">Analysis Failed</p>
              <p>{analysisError}</p>
            </div>
          )}

          {analysis && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="flex items-center gap-2 font-semibold text-gray-800 dark:text-white mb-2">
                <SparklesIcon className="h-5 w-5 text-green-500" />
                Expert Analysis:
              </h4>
              <div
                className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-400"
                dangerouslySetInnerHTML={{ __html: formatAnalysis(analysis) }}
              ></div>
            </div>
          )}

          {isSolutionVisible && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Solution:</h4>
              <div
                className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-400"
                dangerouslySetInnerHTML={{ __html: problem.solution.replace(/\n/g, '<br />') }}
              ></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};