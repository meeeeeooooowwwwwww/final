interface KVNamespace {
  list: (options?: { prefix?: string; limit?: number; cursor?: string }) => Promise<{ keys: { name: string }[]; list_complete: boolean; cursor?: string }>;
  get: (key: string, options?: { type: 'json' }) => Promise<any>;
}

declare global {
  const VIDEO_DATA: KVNamespace;
  const SEARCH_CACHE: Cache;
} 