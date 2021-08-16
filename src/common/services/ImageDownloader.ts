import { AxiosInstance } from 'axios';
import { saveUrl } from '../../utils/helpers/files';

export class ImageDownloader {
  public constructor(private readonly axios: AxiosInstance, private readonly window: Window) {}

  public async saveImage(imgUrl: string, filename: string): Promise<void> {
    const { data } = await this.axios.get(imgUrl, { responseType: 'blob' });
    const url = URL.createObjectURL(data);

    saveUrl(this.window, url, filename);
  }
}
