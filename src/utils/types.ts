export type MediaMatcher = (query: string) => MediaQueryList;

export type Fetch = <T>(url: string, options?: RequestInit) => Promise<T>;
