import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is required");
}

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface FactCheckResult {
  score: number;
  explanation: string;
  suggestions: string[];
}

export async function factCheck(content: string): Promise<FactCheckResult> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a fact-checking expert. Analyze the given content for factual accuracy and provide a score from 0-100, explanation, and suggestions for improvement. Return the results in JSON format."
        },
        {
          role: "user",
          content
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);
    return {
      score: Math.min(100, Math.max(0, result.score)),
      explanation: result.explanation,
      suggestions: result.suggestions,
    };
  } catch (error) {
    throw new Error("Failed to perform fact check: " + error.message);
  }
}

export async function suggestImprovements(content: string): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a content improvement expert. Analyze the given content and suggest improvements for clarity, engagement, and impact. Return an array of suggestions in JSON format."
        },
        {
          role: "user",
          content
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result.suggestions;
  } catch (error) {
    throw new Error("Failed to generate suggestions: " + error.message);
  }
}
