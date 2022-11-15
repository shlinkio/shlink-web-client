import { Fetch } from '../../utils/types';

export class HttpClient {
  constructor(private readonly fetch: Fetch) {}

  public fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
    return this.fetch(url, options).then(async (resp) => {
      const parsed = await resp.json();

      if (!resp.ok) {
        throw parsed;
      }

      return parsed as T;
    });
  }

  public fetchBlob(url: string): Promise<Blob> {
    return this.fetch(url).then((resp) => resp.blob());
  }
}
