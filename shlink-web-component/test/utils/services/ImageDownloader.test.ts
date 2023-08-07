import { ImageDownloader } from '../../../src/utils/services/ImageDownloader';
import { windowMock } from '../../__mocks__/Window.mock';

describe('ImageDownloader', () => {
  const fetch = vi.fn();
  let imageDownloader: ImageDownloader;

  beforeEach(() => {
    (global as any).URL = { createObjectURL: () => '' };

    imageDownloader = new ImageDownloader(fetch, windowMock);
  });

  it('calls URL with response type blob', async () => {
    fetch.mockResolvedValue({ blob: () => new Blob() });

    await imageDownloader.saveImage('/foo/bar.png', 'my-image.png');

    expect(fetch).toHaveBeenCalledWith('/foo/bar.png');
  });
});
