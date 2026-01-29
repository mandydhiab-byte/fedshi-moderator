
export interface Comment {
  id: string;
  author: string;
  authorAvatar: string;
  text: string;
  publishedAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'auto_responded';
  draftResponse?: string;
  actualResponse?: string;
  approvedBy?: string;
  accuracyScore?: number; // 0-100
}

export interface KnowledgeBaseEntry {
  question: string;
  answer: string;
}

export interface User {
  email: string;
  name: string;
  role: 'admin' | 'moderator';
}

export interface AppSettings {
  autoPilot: boolean;
  sheetId: string;
  youtubeChannelId: string;
  apiKey: string;
}

export interface DashboardMetrics {
  totalComments: number;
  approvalRate: number;
  averageAccuracy: number;
  autoRespondedCount: number;
  manualReviewCount: number;
}
