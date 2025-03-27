/// <reference path="../../../types/kv.d.ts" />
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { Video } from '../../../types';
import ErrorBoundary from '../../../components/ErrorBoundary';
import { useState } from 'react';

interface KVNamespace {
  list(options: { prefix: string }): Promise<{ keys: { name: string }[] }>;
  get(key: string, options: { type: 'json' }): Promise<any>;
}

declare const VIDEO_DATA: KVNamespace;

export const runtime = 'experimental-edge';

interface RawVideoData {
  title: string;
  link: string;
  thumbnail: string;
  uploader: string;
  publishedAt?: string;
  duration?: string;
  views?: number;
  description?: string;
}

interface NatalieWintersProps {
  videos: Video[];
  error: string | null;
}

function VideoCard({ video }: { video: Video }) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2">{video.title}</h2>
      <iframe
        src={video.url}
        width="100%"
        height="315"
        frameBorder="0"
        allowFullScreen
        className="rounded-md"
      />
      <div className="mt-2 w-full h-24 relative">
        {isLoading && (
          <div className="w-full h-full bg-gray-200 rounded-md animate-pulse" />
        )}
        <img
          src={hasError ? '/fallback-image.jpg' : video.thumbnail}
          alt={video.title}
          className={`w-full h-full object-cover rounded-md ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setHasError(true);
            setIsLoading(false);
          }}
        />
      </div>
      <p className="text-gray-500 mt-2">
        Uploader: {video.uploader}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {video.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function NatalieWinters({ videos, error }: NatalieWintersProps) {
  return (
    <ErrorBoundary fallback={<div className="container mx-auto px-4 py-12"><h1>Error loading page.</h1></div>}>
      {error ? (
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-8">Natalie Winters Videos</h1>
          <p className="text-red-500">Error: {error}</p>
        </div>
      ) : !videos || videos.length === 0 ? (
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-8">Natalie Winters Videos</h1>
          <p>No videos available.</p>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-12">
          <Head>
            <title>Natalie Winters Videos | Rumble Video Site</title>
            <meta name="description" content="Watch the latest videos from Natalie Winters on Rumble." />
            <meta name="keywords" content="Natalie Winters, videos, news" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <h1 className="text-4xl font-bold mb-8">Natalie Winters Videos</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </div>
      )}
    </ErrorBoundary>
  );
}

export const getServerSideProps: GetServerSideProps<NatalieWintersProps> = async () => {
  try {
    // Fetch all videos from KV store
    const { keys } = await VIDEO_DATA.list({ prefix: '' });

    // Fetch all items in parallel
    const items = await Promise.all(
      keys.map(async key => {
        try {
          const item = await VIDEO_DATA.get(key.name, { type: 'json' });
          return item as Video;
        } catch (error) {
          console.error(`Error fetching item ${key.name}:`, error);
          return null;
        }
      })
    );

    // Filter for Natalie Winters videos
    const videos = items
      .filter((item): item is Video => 
        item !== null && 
        item.type === 'video' &&
        item.uploader === 'Natalie Winters'
      )
      .sort((a, b) => {
        const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        return dateB - dateA;
      });

    return {
      props: {
        videos,
        error: null
      }
    };
  } catch (error) {
    console.error('Error fetching videos:', error);
    return {
      props: {
        videos: [],
        error: 'Failed to fetch videos'
      }
    };
  }
}; 