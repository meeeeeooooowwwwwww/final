import React, { createContext, useContext, useState, useCallback } from 'react';
import { Article, Video } from '../types';

interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  results: (Article | Video)[];
  setResults: (results: (Article | Video)[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: Error | null;
  setError: (error: Error | null) => void;
  search: (searchTerm: string) => Promise<void>;
  clearResults: () => void;
}

const defaultContext: SearchContextType = {
  searchTerm: '',
  setSearchTerm: () => {},
  results: [],
  setResults: () => {},
  loading: false,
  setLoading: () => {},
  error: null,
  setError: () => {},
  search: async () => {},
  clearResults: () => {},
};

const SearchContext = createContext<SearchContextType>(defaultContext);

// The main SearchProvider with full functionality
export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<(Article | Video)[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      clearResults();
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Search failed'));
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [clearResults]);

  const value = {
    searchTerm,
    setSearchTerm,
    results,
    setResults,
    loading,
    setLoading,
    error,
    setError,
    search,
    clearResults,
  };

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

// Client-side wrapper to handle SSG/SSR safely
export function ClientSearchProvider({ children }: { children: React.ReactNode }) {
  if (typeof window === 'undefined') {
    return <SearchContext.Provider value={defaultContext}>{children}</SearchContext.Provider>;
  }
  return <SearchProvider>{children}</SearchProvider>;
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
} 