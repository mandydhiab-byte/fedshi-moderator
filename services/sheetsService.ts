
import { KnowledgeBaseEntry } from '../types';

export const fetchKnowledgeBase = async (sheetId: string): Promise<KnowledgeBaseEntry[]> => {
  try {
    // Using CSV export for simplicity in a backend-less setup
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;
    const response = await fetch(url);
    const text = await response.text();
    
    // Simple CSV parser (assuming first column is Question, second is Answer)
    const lines = text.split('\n');
    const kb: KnowledgeBaseEntry[] = [];
    
    // Skip header
    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); // Basic regex to handle commas in quotes
      if (row.length >= 2) {
        kb.push({
          question: row[0].replace(/^"|"$/g, '').trim(),
          answer: row[1].replace(/^"|"$/g, '').trim()
        });
      }
    }
    return kb;
  } catch (error) {
    console.error('Error fetching Knowledge Base:', error);
    return [];
  }
};
