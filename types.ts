
export interface Problem {
  level: number;
  title: string;
  description: string;
  question: string;
  solution: string;
  hint: string;
}

export interface Workbook {
  topic: string;
  problems: Problem[];
}
