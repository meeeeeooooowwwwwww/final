import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import type { Article } from '../../types';
import Head from 'next/head';

export default function ArticlePage() {
  const router = useRouter();
  const { id } = router.query;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticle() {
      if (!id) return;

      try {
        const response = await fetch(`/api/articles/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch article');
        }
        const data = await response.json();
        setArticle(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load article');
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [id]);

  return (
    <>
      <Head>
        <title>{article ? `${article.title} - GetIt` : 'Loading Article - GetIt'}</title>
        <meta name="description" content={article?.content?.slice(0, 160) || 'Loading article...'} />
      </Head>

      <div className="max-w-4xl mx-auto py-8 px-4">
        {loading ? (
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        ) : error || !article ? (
          <div className="text-red-600">
            {error || 'Article not found'}
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-6">{article.title}</h1>
            <div className="flex items-center text-gray-600 mb-6">
              <span>By {article.author}</span>
              {article.publishedAt && (
                <>
                  <span className="mx-2">•</span>
                  <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                </>
              )}
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-600">{article.content}</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
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