import type { NextApiRequest, NextApiResponse } from 'next';

export const runtime = 'experimental-edge';

interface VideoEntry {
  key: string;
  value: {
    title: string;
    description: string;
    tags: string[];
    [key: string]: any;
  };
}

// Declare the type for the KV binding
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      VIDEO_DATA: {
        get(key: string, options?: { type: 'json' }): Promise<any>;
      };
    }
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const query = (req.query.q as string)?.toLowerCase() || '';

  // Fetch all video data
  const videoKeys = ['videos:warroom', 'videos:natalie-winters'];
  const videos = [];

  for (const key of videoKeys) {
    const data = await process.env.VIDEO_DATA?.get(key, { type: 'json' });
    if (data) {
      // Data is an array of { key, value } objects
      const videoEntries = (data as VideoEntry[]).map(entry => ({
        key: entry.key,
        ...entry.value
      }));
      videos.push(...videoEntries);
    }
  }

  // Search logic: Match on title, description, or tags
  const results = videos.filter(video =>
    video.title?.toLowerCase().includes(query) ||
    video.description?.toLowerCase().includes(query) ||
    video.tags?.some((tag: string) => tag.toLowerCase().includes(query))
  );

  return res.status(200).json({ results });
} 