
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { TopicInputForm } from './components/TopicInputForm';
import { WorkbookDisplay } from './components/WorkbookDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { generateWorkbook } from './services/geminiService';
import { Workbook } from './types';

const App: React.FC = () => {
  const [workbook, setWorkbook] = useState<Workbook | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateWorkbook = useCallback(async (topic: string) => {
    setIsLoading(true);
    setError(null);
    setWorkbook(null);
    try {
      const newWorkbook = await generateWorkbook(topic);
      setWorkbook(newWorkbook);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const WelcomeMessage: React.FC = () => (
    <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Welcome to the Expertise Analyzer</h2>
      <p className="mt-2 text-gray-600 dark:text-gray-300">
        Enter a topic above to generate a custom workbook designed to test your knowledge at various levels of expertise.
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <TopicInputForm onSubmit={handleGenerateWorkbook} isLoading={isLoading} />
          
          <div className="mt-8">
            {isLoading && <LoadingSpinner />}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            {!isLoading && !error && workbook && <WorkbookDisplay workbook={workbook} />}
            {!isLoading && !error && !workbook && <WelcomeMessage />}
          </div>
        </div>
      </main>
      <footer className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
          <p>Powered by Gemini API</p>
      </footer>
    </div>
  );
};

export default App;
