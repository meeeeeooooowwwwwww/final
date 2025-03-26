import React from 'react';
import Head from 'next/head';
import Hero from '../components/Hero';
import LatestVideos from '../components/LatestVideos';
import LatestNews from '../components/LatestNews';
import { Video, Article } from '../types';

interface HomeProps {
  videos: Video[];
  articles: Article[];
}

interface KVKey {
  name: string;
  metadata?: {
    timestamp: number;
  };
}

const Home: React.FC<HomeProps> = ({ videos, articles }) => {
  return (
    <>
      <Head>
        <title>Rumble Video Site</title>
        <meta name="description" content="Search and browse Rumble videos, articles, and businesses" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gray-50">
        {/* Hero Section with Search */}
        <Hero />

        {/* Latest Content Sections */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Latest Videos */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Videos</h2>
              <LatestVideos videos={videos} />
            </div>

            {/* Latest News */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest News</h2>
              <LatestNews articles={articles} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export async function getServerSideProps({ env }: { env: { VIDEO_DATA: KVNamespace } }) {
  try {
    // Get all videos and articles from KV
    const [videosList, articlesList] = await Promise.all([
      env.VIDEO_DATA.list({ prefix: 'video:' }),
      env.VIDEO_DATA.list({ prefix: 'article:' })
    ]);

    // Get the latest 5 items for each
    const latestVideos = await Promise.all(
      (videosList.keys as KVKey[])
        .sort((a, b) => (b.metadata?.timestamp || 0) - (a.metadata?.timestamp || 0))
        .slice(0, 5)
        .map(async (key) => {
          const data = await env.VIDEO_DATA.get(key.name, { type: 'json' });
          return data as Video;
        })
    );

    const latestArticles = await Promise.all(
      (articlesList.keys as KVKey[])
        .sort((a, b) => (b.metadata?.timestamp || 0) - (a.metadata?.timestamp || 0))
        .slice(0, 5)
        .map(async (key) => {
          const data = await env.VIDEO_DATA.get(key.name, { type: 'json' });
          return data as Article;
        })
    );

    return {
      props: {
        videos: latestVideos,
        articles: latestArticles
      }
    };
  } catch (error) {
    console.error('Error fetching data from KV:', error);
    return {
      props: {
        videos: [],
        articles: []
      }
    };
  }
}

export default Home; 