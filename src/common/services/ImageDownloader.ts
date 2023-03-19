import { saveUrl } from '../../utils/helpers/files';
import type { HttpClient } from './HttpClient';

export class ImageDownloader {
  public constructor(private readonly httpClient: HttpClient, private readonly window: Window) {}

  public async saveImage(imgUrl: string, filename: string): Promise<void> {
    const data = await this.httpClient.fetchBlob(imgUrl);
    const url = URL.createObjectURL(data);

    saveUrl(this.window, url, filename);
  }
}
