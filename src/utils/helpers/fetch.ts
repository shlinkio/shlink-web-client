export const jsonFetch = (fetch: typeof window.fetch) => <T>(url: string, options?: RequestInit) => fetch(url, options)
  .then(async (resp) => {
    const parsed = await resp.json();

    if (!resp.ok) {
      throw parsed; // eslint-disable-line @typescript-eslint/no-throw-literal
    }

    return parsed as T;
  });
