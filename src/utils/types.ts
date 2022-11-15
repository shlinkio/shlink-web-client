export type MediaMatcher = (query: string) => MediaQueryList;

export type Fetch = typeof window.fetch;

export type JsonFetch = <T>(url: string, options?: RequestInit) => Promise<T>;
