
import { Comment } from '../types';
import { YOUTUBE_API_KEY } from '../constants';

export const fetchYoutubeComments = async (channelId: string): Promise<Comment[]> => {
  if (!channelId || channelId === 'UC_M_FEDSHI_CHANNEL') {
    console.warn("Using mock data because a valid Channel ID was not provided.");
    return getMockComments();
  }

  try {
    const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&channelId=${channelId}&maxResults=20&order=time&key=${YOUTUBE_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

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
  } catch (error) {
    console.error('Error fetching real YouTube comments:', error);
    return getMockComments(); // Fallback to mock for UI stability
  }
};

const getMockComments = (): Comment[] => {
  const mockAuthors = ['Alice Johnson', 'Bob Smith', 'Charlie Brown', 'Dana White', 'Eva Green'];
  const mockCommentsText = [
    "How do I track my order from the Fedshi portal?",
    "What is the return policy for international shipping?",
    "Great video! Keep it up.",
    "Do you offer discounts for bulk purchases?",
    "Can I pay using cryptocurrency on Fedshi?"
  ];

  return mockCommentsText.map((text, i) => ({
    id: `yt-mock-${Date.now()}-${i}`,
    author: mockAuthors[i % mockAuthors.length],
    authorAvatar: `https://picsum.photos/seed/${i}/100/100`,
    text,
    publishedAt: new Date(Date.now() - (i * 1000 * 60 * 60)).toISOString(),
    status: 'pending'
  }));
};

// In a real production app, this would require an OAuth2 Access Token
export const postYoutubeReply = async (parentId: string, text: string): Promise<boolean> => {
  console.log(`[SIMULATION] Posting reply to ${parentId}: ${text}`);
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return true;
};
