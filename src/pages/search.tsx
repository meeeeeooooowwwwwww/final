import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import SearchBar from '../components/SearchBar';
import ResultList from '../components/ResultList';
import { useSearch } from '../context/SearchContext';
import { Article, Video } from '../types';
import ErrorBoundary from '../components/ErrorBoundary';

export default function SearchPage() {
  const router = useRouter();
  const { q } = router.query;
  const searchContext = useSearch();
  const { searchTerm, setSearchTerm, search, results, loading, error } = searchContext;

  useEffect(() => {
    if (typeof q === 'string' && q.trim() && searchTerm !== q) {
      setSearchTerm(q);
      search(q);
    }
  }, [q, searchTerm, setSearchTerm, search]);

  return (
    <>
      <Head>
        <title>Search Results for "{q || ''}" - GetIt</title>
        <meta name="description" content={`Search results for "${q || ''}" on GetIt`} />
      </Head>
      <ErrorBoundary>
        <div className="min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <SearchBar placeholder="Search again..." />
            </div>
            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error.message}</span>
              </div>
            )}
            {!loading && !error && (
              <>
                <h1 className="text-2xl font-bold mb-4">
                  Search Results for "{q || ''}"
                </h1>
                <ResultList results={results as (Article | Video)[]} />
              </>
            )}
          </div>
        </div>
      </ErrorBoundary>
    </>
  );
}

// Add getServerSideProps to handle server-side rendering
export async function getServerSideProps() {
  return {
    props: {}, // Return empty props since we'll handle data fetching on the client side
  };
} 