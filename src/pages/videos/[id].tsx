import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import type { Video } from '../../types';
import Head from 'next/head';

export default function VideoPage() {
  const router = useRouter();
  const { id } = router.query;
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVideo() {
      if (!id) return;

      try {
        const response = await fetch(`/api/videos/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch video');
        }
        const data = await response.json();
        setVideo(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load video');
      } finally {
        setLoading(false);
      }
    }

    fetchVideo();
  }, [id]);

  return (
    <>
      <Head>
        <title>{video ? `${video.title} - GetIt` : 'Loading Video - GetIt'}</title>
        <meta name="description" content={video?.description || 'Loading video...'} />
      </Head>

      <div className="max-w-4xl mx-auto py-8 px-4">
        {loading ? (
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded mb-6"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        ) : error || !video ? (
          <div className="text-red-600">
            {error || 'Video not found'}
          </div>
        ) : (
          <>
            <div className="aspect-w-16 aspect-h-9 mb-6">
              <iframe
                src={video.url}
                className="w-full h-full rounded-lg"
                allowFullScreen
                title={video.title}
              />
            </div>

            <h1 className="text-3xl font-bold mb-4">{video.title}</h1>
            
            <div className="flex items-center text-gray-600 mb-4">
              <span>By {video.uploader}</span>
              {video.publishedAt && (
                <>
                  <span className="mx-2">•</span>
                  <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
                </>
              )}
              {video.views && (
                <>
                  <span className="mx-2">•</span>
                  <span>{video.views.toLocaleString()} views</span>
                </>
              )}
              {video.duration && (
                <>
                  <span className="mx-2">•</span>
                  <span>{video.duration}</span>
                </>
              )}
            </div>

            {video.description && (
              <p className="text-gray-700 mb-6 whitespace-pre-wrap">{video.description}</p>
            )}

            <div className="flex flex-wrap gap-2">
              {video.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

// Add getServerSideProps to handle server-side rendering
export async function getServerSideProps() {
  return {
    props: {}, // Return empty props since we'll handle data fetching on the client side
  };
} 