import { Mock } from 'ts-mockery';
import { AxiosInstance } from 'axios';
import { ImageDownloader } from '../../../src/common/services/ImageDownloader';
import { windowMock } from '../../mocks/WindowMock';

describe('ImageDownloader', () => {
  const get = jest.fn();
  const axios = Mock.of<AxiosInstance>({ get });
  let imageDownloader: ImageDownloader;

  beforeEach(() => {
    jest.clearAllMocks();
    (global as any).URL = { createObjectURL: () => '' };

    imageDownloader = new ImageDownloader(axios, windowMock);
  });

  test('calls URL with response type blob', async () => {
    get.mockResolvedValue({ data: {} });

    await imageDownloader.saveImage('/foo/bar.png', 'my-image.png');

    expect(get).toHaveBeenCalledWith('/foo/bar.png', { responseType: 'blob' });
  });
});
