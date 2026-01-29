import { KnowledgeBaseEntry } from '../types.ts';

export const fetchKnowledgeBase = async (sheetId: string): Promise<KnowledgeBaseEntry[]> => {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;
    const response = await fetch(url);
    const text = await response.text();
    
    const lines = text.split('\n');
    const kb: KnowledgeBaseEntry[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
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