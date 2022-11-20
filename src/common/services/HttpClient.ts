import { Fetch } from '../../utils/types';

export class HttpClient {
  constructor(private readonly fetch: Fetch) {}

  public readonly fetchJson = <T>(url: string, options?: RequestInit): Promise<T> =>
    this.fetch(url, options).then(async (resp) => {
      const json = await resp.json();

      if (!resp.ok) {
        throw json;
      }

      return json as T;
    });

  public readonly fetchEmpty = (url: string, options?: RequestInit): Promise<void> =>
    this.fetch(url, options).then(async (resp) => {
      if (!resp.ok) {
        throw await resp.json();
      }
    });

  public readonly fetchBlob = (url: string): Promise<Blob> => this.fetch(url).then((resp) => resp.blob());
}
