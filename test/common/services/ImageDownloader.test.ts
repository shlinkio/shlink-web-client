import { Mock } from 'ts-mockery';
import type { HttpClient } from '../../../src/common/services/HttpClient';
import { ImageDownloader } from '../../../src/common/services/ImageDownloader';
import { windowMock } from '../../__mocks__/Window.mock';

describe('ImageDownloader', () => {
  const fetchBlob = jest.fn();
  const httpClient = Mock.of<HttpClient>({ fetchBlob });
  let imageDownloader: ImageDownloader;

  beforeEach(() => {
    jest.clearAllMocks();
    (global as any).URL = { createObjectURL: () => '' };

    imageDownloader = new ImageDownloader(httpClient, windowMock);
  });

  it('calls URL with response type blob', async () => {
    fetchBlob.mockResolvedValue(new Blob());

    await imageDownloader.saveImage('/foo/bar.png', 'my-image.png');

    expect(fetchBlob).toHaveBeenCalledWith('/foo/bar.png');
  });
});
