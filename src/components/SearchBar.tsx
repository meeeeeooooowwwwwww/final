import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSearch } from '../context/SearchContext';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  onSearch?: (searchTerm: string) => void;
}

export default function SearchBar({
  placeholder = "Search videos, articles, and businesses...",
  className = "",
  onSearch,
}: SearchBarProps) {
  const router = useRouter();
  const context = useSearch();

  // Fallback UI during SSR/SSG if context is not available
  if (!context) {
    return (
      <form className={`w-full ${className}`}>
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder={placeholder}
            className="w-full px-6 py-4 text-lg text-gray-900 bg-white/95 backdrop-blur-sm border-2 border-gray-300 rounded-lg shadow-xl 
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      placeholder-gray-400
                      disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
                      transition-colors duration-200"
            disabled
          />
          <button
            type="submit"
            disabled
            className="absolute right-3 top-1/2 transform -translate-y-1/2 
                      px-6 py-2 text-lg font-medium text-white bg-blue-600 rounded-md 
                      hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 
                      disabled:opacity-50 disabled:cursor-not-allowed 
                      transition-all duration-200 ease-in-out
                      shadow-md hover:shadow-lg"
          >
            Search
          </button>
        </div>
      </form>
    );
  }

  const { searchTerm, setSearchTerm, search } = context;
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const { q } = router.query;
    if (typeof q === 'string') {
      setSearchTerm(q);
    }
  }, [router.query, setSearchTerm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    try {
      await search(searchTerm);
      if (onSearch) {
        onSearch(searchTerm);
      } else {
        router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`w-full ${className}`}>
      <div className="relative flex items-center">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full px-6 py-4 text-lg text-gray-900 bg-white/95 backdrop-blur-sm border-2 border-gray-300 rounded-lg shadow-xl 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    placeholder-gray-400
                    disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
                    transition-colors duration-200"
          disabled={isSearching}
        />
        <button
          type="submit"
          disabled={isSearching}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 
                    px-6 py-2 text-lg font-medium text-white bg-blue-600 rounded-md 
                    hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 
                    disabled:opacity-50 disabled:cursor-not-allowed 
                    transition-all duration-200 ease-in-out
                    shadow-md hover:shadow-lg"
        >
          {isSearching ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Searching...
            </span>
          ) : (
            'Search'
          )}
        </button>
      </div>
    </form>
  );
} 