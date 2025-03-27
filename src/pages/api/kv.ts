/// <reference path="../../types/kv.d.ts" />
import { Item, Video, Article, Business } from '@/types';

export const runtime = 'experimental-edge';

async function generateETag(data: any): Promise<string> {
  const str = JSON.stringify(data);
  const buffer = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export default async function handler(req: Request) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const url = new URL(req.url);
    const searchTerm = url.searchParams.get('prefix')?.toLowerCase() || '';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = 20; // Items per page

    // Fetch fresh data
    const { keys, list_complete, cursor } = await VIDEO_DATA.list({
      limit: 100 // Adjust based on your needs
    });

    // Fetch all items in parallel
    const items = await Promise.all(
      keys.map(async key => {
        try {
          const item = await VIDEO_DATA.get(key.name, { type: 'json' });
          return item as Item;
        } catch (error) {
          console.error(`Error fetching item ${key.name}:`, error);
          return null;
        }
      })
    );

    // Filter out failed fetches and apply search
    const validItems = items.filter((item): item is Item => {
      if (!item) return false;

      // Check title/name based on item type
      if (item.type === 'video' || item.type === 'article') {
        if (item.title.toLowerCase().includes(searchTerm)) return true;
      } else if (item.type === 'business') {
        if (item.name.toLowerCase().includes(searchTerm)) return true;
      }

      // Check type-specific fields
      if (item.type === 'video') {
        const video = item as Video;
        return video.description?.toLowerCase().includes(searchTerm) ||
               video.tags.some(tag => tag.toLowerCase().includes(searchTerm));
      }

      if (item.type === 'article') {
        const article = item as Article;
        return article.summary?.toLowerCase().includes(searchTerm) ||
               article.tags.some(tag => tag.toLowerCase().includes(searchTerm));
      }

      if (item.type === 'business') {
        const business = item as Business;
        return business.description?.toLowerCase().includes(searchTerm) ||
               business.tags.some(tag => tag.toLowerCase().includes(searchTerm));
      }

      return false;
    });

    // Implement pagination
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedItems = validItems.slice(start, end);

    // Prepare response data
    const responseData = {
      items: paginatedItems,
      pagination: {
        total: validItems.length,
        page,
        pages: Math.ceil(validItems.length / limit),
        hasMore: !list_complete || end < validItems.length,
        cursor: cursor
      }
    };

    // Generate ETag for the response
    const etag = await generateETag(responseData);

    // Check if client has a valid cached version
    const ifNoneMatch = req.headers.get('if-none-match');
    if (ifNoneMatch === etag) {
      return new Response(null, { status: 304 });
    }

    // Create new response with cache headers
    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=600', // Cache for 1 minute, stale for 10 minutes
        'ETag': etag,
        'Vary': 'Accept-Encoding'
      }
    });
  } catch (error: unknown) {
    console.error('KV fetch error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch data',
        details: process.env.NODE_ENV === 'development' ? 
          error instanceof Error ? error.message : String(error) 
          : undefined
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
} 