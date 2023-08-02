import { saveUrl } from '../helpers/files';
import type { Fetch } from '../types';

export class ImageDownloader {
  public constructor(private readonly fetch: Fetch, private readonly window: Window) {}

  public async saveImage(imgUrl: string, filename: string): Promise<void> {
    const data = await this.fetch(imgUrl).then((resp) => resp.blob());
    const url = URL.createObjectURL(data);

    saveUrl(this.window, url, filename);
  }
}
