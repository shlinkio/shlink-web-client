type Fetch = typeof window.fetch;

export type RequestOptions = {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: string;
  headers?: Record<string, string>;
};

const applicationJsonHeader = { 'Content-Type': 'application/json' };
const withJsonContentType = (options?: RequestOptions): RequestInit | undefined => {
  if (!options?.body) {
    return options;
  }

  return options ? {
    ...options,
    headers: {
      ...(options.headers ?? {}),
      ...applicationJsonHeader,
    },
  } : {
    headers: applicationJsonHeader,
  };
};

export class HttpClient {
  constructor(private readonly fetch: Fetch) {}

  public readonly fetchJson = <T>(url: string, options?: RequestOptions): Promise<T> =>
    this.fetch(url, withJsonContentType(options)).then(async (resp) => {
      const json = await resp.json();

      if (!resp.ok) {
        throw json;
      }

      return json as T;
    });

  public readonly fetchEmpty = (url: string, options?: RequestOptions): Promise<void> =>
    this.fetch(url, withJsonContentType(options)).then(async (resp) => {
      if (!resp.ok) {
        throw await resp.json();
      }
    });
}
