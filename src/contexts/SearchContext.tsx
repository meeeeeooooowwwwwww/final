import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Item } from '../types';

interface SearchContextType {
  query: string;
  setQuery: (query: string) => void;
  results: Item[];
  loading: boolean;
  error: Error | null;
  search: (query: string) => Promise<void>;
  clearResults: () => void;
}

const SearchContext = createContext<SearchContextType | null>(null);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Clear results when query is empty
  useEffect(() => {
    if (!query.trim()) {
      clearResults();
    }
  }, [query]);

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
      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }
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
    query,
    setQuery,
    results,
    loading,
    error,
    search,
    clearResults,
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
} 