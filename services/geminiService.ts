import { GoogleGenAI, Type } from "@google/genai";
import { Workbook } from '../types';

const WORKBOOK_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    topic: { 
      type: Type.STRING,
      description: 'The topic of the workbook.'
    },
    problems: {
      type: Type.ARRAY,
      description: 'A list of 5 problems with increasing difficulty.',
      items: {
        type: Type.OBJECT,
        properties: {
          level: { 
            type: Type.INTEGER, 
            description: "Difficulty level, from 1 (beginner) to 5 (expert)." 
          },
          title: { 
            type: Type.STRING, 
            description: "A short, engaging title for the problem, related to the concept being tested." 
          },
          description: { 
            type: Type.STRING, 
            description: "A brief one-sentence explanation of the concept being tested at this level." 
          },
          question: { 
            type: Type.STRING, 
            description: "The specific question, task, or problem for the user to solve." 
          },
          solution: { 
            type: Type.STRING, 
            description: "A detailed, correct solution to the problem." 
          },
          hint: { 
            type: Type.STRING, 
            description: "A helpful hint if the user gets stuck, guiding them towards the solution without giving it away." 
          },
        },
        required: ['level', 'title', 'description', 'question', 'solution', 'hint']
      }
    }
  },
  required: ['topic', 'problems']
};


export const generateWorkbook = async (topic: string): Promise<Workbook> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `Generate an interactive workbook with exactly 5 problems to analyze a user's expertise on the topic: "${topic}". The problems must require progressively increasing expertise to solve, starting from a beginner level (1) and going up to an expert level (5). Each problem must be distinct and test a different aspect or a more advanced concept of the topic.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: WORKBOOK_SCHEMA,
        temperature: 0.7,
      },
    });

    const jsonText = response.text.trim();
    const workbookData = JSON.parse(jsonText) as Workbook;
    
    // Sort problems by level just in case the model returns them out of order
    workbookData.problems.sort((a, b) => a.level - b.level);
    
    return workbookData;
  } catch (error) {
    console.error("Error generating workbook:", error);
    throw new Error("Failed to generate the workbook. The topic might be too broad or the API is unavailable.");
  }
};

export const analyzeAnswer = async (
  topic: string,
  question: string,
  solution: string,
  userAnswer: string
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    You are an expert in the field of "${topic}". 
    A user is working through a problem set to test their knowledge.
    
    The user was presented with the following problem:
    Question: "${question}"

    For your reference, the ideal solution is:
    Solution: "${solution}"

    The user submitted the following answer:
    User's Answer: "${userAnswer}"

    Your task is to provide a critical yet constructive analysis of the user's answer.
    - Evaluate its correctness and completeness.
    - Identify any specific misconceptions or errors.
    - Highlight what the user did well and understood correctly.
    - Provide clear, actionable suggestions for improvement.
    - Keep the tone encouraging and helpful. Address the user directly.
    - Do not just state if it's right or wrong, provide a thoughtful explanation.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.5,
      },
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error analyzing answer:", error);
    throw new Error("Failed to get analysis from the expert. Please try again.");
  }
};
