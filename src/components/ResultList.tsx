import React from 'react';
import { Article, Video } from '../types';
import Link from 'next/link';
import LoadingSpinner from './LoadingSpinner';
import ErrorBoundary from './ErrorBoundary';

interface ResultListProps {
  results: (Article | Video)[];
  loading?: boolean;
  error?: string | null;
}

const ResultListContent: React.FC<ResultListProps> = ({ results, loading, error }) => {
  if (!results || results.length === 0) {
    return <div className="text-center py-8">No results found.</div>;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const formatDate = (date: string | undefined) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {results.map((item) => (
        <div key={item.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
          {item.type === 'article' ? (
            <>
              <Link href={`/articles/${item.id}`}>
                <h2 className="text-xl font-semibold text-blue-600 hover:underline">{item.title}</h2>
              </Link>
              <p className="text-gray-600 mt-1">{item.summary}</p>
              <p className="text-sm text-gray-500 mt-2">
                By {item.author} | {formatDate(item.publishedAt)}
              </p>
              <p className="text-sm text-gray-500">Tags: {item.tags.join(', ')}</p>
            </>
          ) : (
            <>
              <Link href={`/videos/${item.id}`}>
                <h2 className="text-xl font-semibold text-blue-600 hover:underline">{item.title}</h2>
              </Link>
              <div className="flex mt-2">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-32 h-18 object-cover rounded mr-4"
                />
                <div>
                  <p className="text-gray-600">{item.description}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {item.duration} | {item.views} views | {formatDate(item.publishedAt)}
                  </p>
                  <p className="text-sm text-gray-500">Tags: {item.tags.join(', ')}</p>
                </div>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

const ResultList: React.FC<ResultListProps> = (props) => {
  return (
    <ErrorBoundary>
      <ResultListContent {...props} />
    </ErrorBoundary>
  );
};

export default ResultList; 