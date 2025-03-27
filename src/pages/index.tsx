import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Hero from '../components/Hero';
import LatestVideos from '../components/LatestVideos';
import LatestNews from '../components/LatestNews';
import { Video, Article } from '../types';

export const runtime = 'experimental-edge';

const Home: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch latest videos
        const videosRes = await fetch('/api/latest?type=videos');
        const { results: latestVideos } = await videosRes.json();
        setVideos(latestVideos || []);

        // Fetch latest articles
        const articlesRes = await fetch('/api/latest?type=articles');
        const { results: latestArticles } = await articlesRes.json();
        setArticles(latestArticles || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              ) : (
                <LatestVideos videos={videos} />
              )}
            </div>

            {/* Latest News */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest News</h2>
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              ) : (
                <LatestNews articles={articles} />
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home; 