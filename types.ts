// Fix: Defining the data structures for the application.
export type Problem = {
  level: 'Beginner' | 'Intermediate' | 'Expert';
  question: string;
  solution: string;
};

export type Workbook = {
  topic: string;
  problems: Problem[];
};
