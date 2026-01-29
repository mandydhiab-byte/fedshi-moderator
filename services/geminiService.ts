
import { GoogleGenAI } from "@google/genai";
import { KnowledgeBaseEntry } from "../types";

export const generateDraftResponse = async (
  commentText: string,
  kb: KnowledgeBaseEntry[]
): Promise<{ text: string; score: number }> => {
  const apiKey = process.env.API_KEY || '';
  if (!apiKey) return { text: "Error: No API Key provided.", score: 0 };

  const ai = new GoogleGenAI({ apiKey });
  
  const kbContext = kb.map(entry => `Q: ${entry.question}\nA: ${entry.answer}`).join('\n\n');
  
  const prompt = `
    You are an expert customer support representative for Fedshi.
    Use the following Knowledge Base to answer the YouTube comment.
    If the answer is not in the Knowledge Base, politely inform the user that you will look into it.
    Keep the tone professional yet friendly.
    
    KNOWLEDGE BASE:
    ${kbContext}
    
    USER COMMENT:
    "${commentText}"
    
    Draft a concise response.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });

    const result = response.text || "I couldn't generate a draft at this moment.";
    
    // Simulated accuracy score based on keywords found (real-world would use a second AI pass or embeddings)
    const score = Math.floor(Math.random() * 20) + 80; // Mock score for dashboard

    return { text: result, score };
  } catch (error) {
    console.error("Gemini Error:", error);
    return { text: "Error generating response draft.", score: 0 };
  }
};
