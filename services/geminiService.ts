// Fix: Implementing the Gemini API service to generate a workbook.
import { GoogleGenAI, Type } from "@google/genai";
import { Workbook } from '../types';

// The API key must be obtained exclusively from the environment variable `process.env.API_KEY`.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateWorkbook = async (topic: string): Promise<Workbook> => {
  // Use gemini-2.5-flash for basic text tasks.
  const model = 'gemini-2.5-flash';

  const prompt = `Create an expertise workbook for the topic: "${topic}".
The workbook should contain exactly 3 problems: one "Beginner", one "Intermediate", and one "Expert" level.
Each problem must include a detailed question and a comprehensive solution.
The solution should not just give the answer, but also explain the reasoning behind it.

To ensure a comprehensive test, please generate a DIVERSE set of problems. For example, include a mix of the following types:
- A definition-based question (e.g., "What is...? Explain the core concept.")
- An application-based question (e.g., "How would you use X to solve Y? Provide a code sample or practical steps.")
- A debugging or troubleshooting question (e.g., "This code/scenario is broken. Identify the problem and explain how to fix it.")

For the topic "${topic}", generate these three problems and ensure the topic in the response matches the requested topic exactly.
`;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      topic: { type: Type.STRING },
      problems: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            level: { type: Type.STRING, enum: ['Beginner', 'Intermediate', 'Expert'] },
            question: { type: Type.STRING },
            solution: { type: Type.STRING },
          },
          required: ['level', 'question', 'solution'],
        },
      },
    },
    required: ['topic', 'problems'],
  };

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema,
      },
    });

    const text = response.text;
    const workbookData = JSON.parse(text);

    // Basic validation to ensure the API returned a valid structure.
    if (!workbookData.topic || !Array.isArray(workbookData.problems) || workbookData.problems.length === 0) {
      throw new Error('Invalid workbook structure received from API.');
    }

    return workbookData as Workbook;
  } catch (error) {
    console.error("Error generating workbook:", error);
    // Provide a user-friendly error message.
    throw new Error("Failed to generate the workbook. Please check your API key and try again.");
  }
};

export const analyzeAnswer = async (
  topic: string,
  question: string,
  solution: string,
  userAnswer: string
): Promise<string> => {
  const model = 'gemini-2.5-flash';

  const prompt = `
    As an expert in "${topic}", provide a succinct, critical analysis of the following user's answer to a problem.

    **The Problem:**
    ${question}

    **The Ideal Solution:**
    ${solution}

    **The User's Submitted Answer:**
    ${userAnswer}

    ---

    Please structure your feedback in the following format, using markdown for lists and bolding:

    **Key Strengths:**
    - List the key concepts or solutions the user correctly identified.

    **Areas for Improvement:**
    - List the key weaknesses, inaccuracies, or missing details in the user's answer.

    **Alignment with Optimal Solution:**
    - Provide a short summary (1-2 sentences) of how well the user's solution aligns with the ideal solution.

    **Competency Focus (if applicable):**
    - If the user's solution is fundamentally incorrect or misses the core concept, identify the key competency they seem to be lacking. Politely advise them to review this specific area within "${topic}". If the answer is reasonably good, omit this section.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error analyzing answer:", error);
    throw new Error("Failed to get expert analysis. The service may be temporarily unavailable.");
  }
};