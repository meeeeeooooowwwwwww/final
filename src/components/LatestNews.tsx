import React from 'react';
import { Article } from '../types';

interface LatestNewsProps {
  articles: Article[];
}

const LatestNews: React.FC<LatestNewsProps> = ({ articles }) => {
  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-6">Latest News</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <div key={article.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
            <h3 className="font-semibold text-lg mb-2 hover:text-blue-600 transition-colors">{article.title}</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{article.summary}</p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>By {article.author}</span>
              <span>Published: {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LatestNews; 