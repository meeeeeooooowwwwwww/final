/// <reference path="../../types/kv.d.ts" />
import type { NextRequest } from 'next/server';
import { Item } from '../../types';

export const runtime = 'edge';

interface KVNamespace {
  list: (options?: { prefix?: string; limit?: number; cursor?: string }) => Promise<{ keys: { name: string }[]; list_complete: boolean; cursor?: string }>;
  get: (key: string, options?: { type: 'json' }) => Promise<any>;
}

declare global {
  const VIDEO_DATA: KVNamespace;
}

export default async function handler(req: NextRequest) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return new Response(null, { status: 405 });
  }

  try {
    // Fetch the latest items from KV store
    const { keys } = await VIDEO_DATA.list({
      limit: 10 // Get the 10 most recent items
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

    // Filter out any failed fetches
    const validItems = items.filter((item): item is Item => item !== null);

    // Sort by publishedAt date, most recent first
    validItems.sort((a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return dateB - dateA;
    });

    return new Response(JSON.stringify(validItems), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=600' // Cache for 1 minute, stale for 10 minutes
      },
    });
  } catch (error) {
    console.error('Error fetching latest items:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch latest items',
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