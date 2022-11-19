import { Fetch } from '../../utils/types';

export class HttpClient {
  constructor(private readonly fetch: Fetch) {}

  public fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
    return this.fetch(url, options).then(async (resp) => {
      if (!resp.ok) {
        throw await resp.json();
      }

      try {
        return (await resp.json()) as T;
      } catch (e) {
        return undefined as T;
      }
    });
  }

  public fetchBlob(url: string): Promise<Blob> {
    return this.fetch(url).then((resp) => resp.blob());
  }
}
