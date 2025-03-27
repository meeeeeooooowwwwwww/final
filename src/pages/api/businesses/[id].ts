/// <reference path="../../../types/kv.d.ts" />
import type { NextRequest } from 'next/server';
import { Business } from '../../../types';

export const runtime = 'experimental-edge';

export default async function handler(req: NextRequest) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return new Response(null, { status: 405 });
  }

  try {
    const id = req.url.split('/').pop();
    if (!id) {
      return new Response(JSON.stringify({ error: 'Business ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Fetch business from KV store
    const business = await VIDEO_DATA.get(id, { type: 'json' });
    
    if (!business || business.type !== 'business') {
      return new Response(JSON.stringify({ error: 'Business not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(business), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=600' // Cache for 1 minute, stale for 10 minutes
      }
    });
  } catch (error) {
    console.error('Error fetching business:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch business',
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