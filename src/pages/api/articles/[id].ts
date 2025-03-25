/// <reference path="../../../types/kv.d.ts" />
import type { NextRequest } from 'next/server';
import { Article } from '../../../types';

export const runtime = 'edge';

export default async function handler(req: NextRequest) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return new Response(null, { status: 405 });
  }

  try {
    const id = req.url.split('/').pop();
    if (!id) {
      return new Response(JSON.stringify({ error: 'Article ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Fetch article from KV store
    const article = await VIDEO_DATA.get(id, { type: 'json' });
    
    if (!article || article.type !== 'article') {
      return new Response(JSON.stringify({ error: 'Article not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(article), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=600' // Cache for 1 minute, stale for 10 minutes
      }
    });
  } catch (error) {
    console.error('Error fetching article:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch article',
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