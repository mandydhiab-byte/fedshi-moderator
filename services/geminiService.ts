import { GoogleGenAI, Type } from "@google/genai";
import { KnowledgeBaseEntry } from "../types.ts";

export const generateDraftResponse = async (
  commentText: string,
  kb: KnowledgeBaseEntry[]
): Promise<{ text: string; score: number }> => {
  const apiKey = (window as any).process?.env?.API_KEY || (typeof process !== 'undefined' ? process.env.API_KEY : '');
  
  if (!apiKey) {
    console.warn("Gemini API Key missing. AI drafting will be disabled.");
    return { text: "AI Drafting Note: Please ensure your Gemini API Key is configured in the environment to enable responses.", score: 0 };
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const kbContext = kb.length > 0 
    ? kb.map(entry => `Question: ${entry.question}\nAnswer: ${entry.answer}`).join('\n\n')
    : "No knowledge base entries available.";
  
  const prompt = `
    You are an expert customer support representative for Fedshi.
    Your task is to draft a helpful, professional, and friendly response to a YouTube comment.
    
    KNOWLEDGE BASE CONTEXT:
    ${kbContext}
    
    USER COMMENT TO RESPOND TO:
    "${commentText}"
    
    INSTRUCTIONS:
    1. If the answer is found in the Knowledge Base, use that information to draft the response.
    2. If the answer is NOT in the Knowledge Base, politely say you don't have that specific information yet and will look into it.
    3. Return a "confidenceScore" between 0 and 100 based on how well the Knowledge Base covers the user's query.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            draftResponse: {
              type: Type.STRING,
              description: "The drafted response to the user's comment."
            },
            confidenceScore: {
              type: Type.NUMBER,
              description: "A score from 0 to 100 indicating how confident you are in the answer based on the KB."
            }
          },
          required: ["draftResponse", "confidenceScore"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    return { 
      text: data.draftResponse || "I couldn't generate a specific draft.", 
      score: data.confidenceScore || 0 
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    return { text: "AI Error: Could not generate response draft.", score: 0 };
  }
};