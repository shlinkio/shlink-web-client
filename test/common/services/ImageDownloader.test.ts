import { fromPartial } from '@total-typescript/shoehorn';
import { ImageDownloader } from '../../../shlink-web-component/utils/services/ImageDownloader';
import type { HttpClient } from '../../../src/common/services/HttpClient';
import { windowMock } from '../../__mocks__/Window.mock';

describe('ImageDownloader', () => {
  const fetchBlob = vi.fn();
  const httpClient = fromPartial<HttpClient>({ fetchBlob });
  let imageDownloader: ImageDownloader;

  beforeEach(() => {
    (global as any).URL = { createObjectURL: () => '' };

    imageDownloader = new ImageDownloader(httpClient, windowMock);
  });

  it('calls URL with response type blob', async () => {
    fetchBlob.mockResolvedValue(new Blob());

    await imageDownloader.saveImage('/foo/bar.png', 'my-image.png');

    expect(fetchBlob).toHaveBeenCalledWith('/foo/bar.png');
  });
});
