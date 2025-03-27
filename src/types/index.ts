export interface Video {
  type: 'video';
  id: string;           // Derived from link (e.g., "v6q2v54")
  title: string;
  url: string;          // Transformed embed URL (e.g., "https://rumble.com/embed/v6q2v54")
  thumbnail: string;
  uploader: string;
  publishedAt?: string; // Optional, since not in your data yet
  duration?: string;    // Video duration (e.g., "10:30")
  views?: number;       // Number of views
  description?: string; // Video description
  tags: string[];      // Video tags
}

export interface Article {
  type: 'article';
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  publishedAt: string;
  tags: string[];
}

export interface Business {
  type: 'business';
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  tags: string[];      // For categorization and search
  publishedAt: string; // When the listing was created/published
  isPaid: boolean;     // Whether this is a paid listing
  tier: number;        // Business tier level (e.g., 1, 2, 3)
}

export type Item = Video | Article | Business; 