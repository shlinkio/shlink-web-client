import { ImageDownloader } from '../../../src/common/services/ImageDownloader';
import { windowMock } from '../../__mocks__/Window.mock';

describe('ImageDownloader', () => {
  const fetch = jest.fn();
  let imageDownloader: ImageDownloader;

  beforeEach(() => {
    jest.clearAllMocks();
    (global as any).URL = { createObjectURL: () => '' };

    imageDownloader = new ImageDownloader(fetch, windowMock);
  });

  it('calls URL with response type blob', async () => {
    fetch.mockResolvedValue({ blob: () => new Blob() });

    await imageDownloader.saveImage('/foo/bar.png', 'my-image.png');

    expect(fetch).toHaveBeenCalledWith('/foo/bar.png');
  });
});
