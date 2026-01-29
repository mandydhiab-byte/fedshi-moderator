import { Comment } from '../types.ts';
import { YOUTUBE_API_KEY } from '../constants.ts';

export class YoutubeApiError extends Error {
  public refererError: boolean;
  constructor(message: string, refererError: boolean = false) {
    super(message);
    this.refererError = refererError;
  }
}

export const fetchYoutubeComments = async (channelId: string): Promise<Comment[]> => {
  if (!channelId || channelId.includes('_MOCK') || channelId === 'UC_M_FEDSHI_CHANNEL') {
    return getMockComments();
  }

  try {
    const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&channelId=${channelId}&maxResults=20&order=time&key=${YOUTUBE_API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      let errorMessage = `HTTP Error: ${response.status}`;
      let isRefererError = false;
      try {
        const errorData = await response.json();
        if (errorData.error) {
          errorMessage = errorData.error.message;
          const msg = errorMessage.toLowerCase();
          isRefererError = msg.includes('referer') || msg.includes('blocked') || msg.includes('permission_denied');
        }
      } catch (e) {}
      throw new YoutubeApiError(errorMessage, isRefererError);
    }

    const data = await response.json();
    return (data.items || []).map((item: any) => {
      const snippet = item.snippet.topLevelComment.snippet;
      return {
        id: item.id,
        author: snippet.authorDisplayName,
        authorAvatar: snippet.authorProfileImageUrl,
        text: snippet.textDisplay,
        publishedAt: snippet.publishedAt,
        status: 'pending'
      };
    });
  } catch (error: any) {
    if (error instanceof YoutubeApiError) throw error;
    throw new YoutubeApiError("Network error. Check your API key restrictions.", true);
  }
};

const getMockComments = (): Comment[] => {
  const mockAuthors = ['Alice Johnson', 'Fedshi Fan #1', 'Tech Guru', 'Dana White', 'Eva Support'];
  const mockCommentsText = [
    "How do I track my order from the Fedshi portal?",
    "What is the return policy for international shipping to Dubai?",
    "Does Fedshi support cash on delivery for new sellers?",
    "Do you offer discounts for bulk purchases over 100 units?",
    "Can I pay using cryptocurrency on Fedshi platform?"
  ];

  return mockCommentsText.map((text, i) => ({
    id: `yt-mock-${Date.now()}-${i}`,
    author: mockAuthors[i % mockAuthors.length],
    authorAvatar: `https://i.pravatar.cc/150?u=${i}`,
    text,
    publishedAt: new Date(Date.now() - (i * 1000 * 60 * 60 * 2)).toISOString(),
    status: 'pending'
  }));
};

export const postYoutubeReply = async (parentId: string, text: string): Promise<boolean> => {
  console.log(`[SIMULATION] Posting reply to ${parentId}: ${text}`);
  await new Promise(resolve => setTimeout(resolve, 800));
  return true;
};