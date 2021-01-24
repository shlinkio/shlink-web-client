import { buildQrCodeUrl, QrCodeFormat } from '../../../src/utils/helpers/qrCodes';

describe('qrCodes', () => {
  describe('buildQrCodeUrl', () => {
    test.each([
      [ 'foo.com', 530, 'svg', { useSizeInPath: true, svgIsSupported: true }, 'foo.com/qr-code/530?format=svg' ],
      [ 'foo.com', 530, 'png', { useSizeInPath: true, svgIsSupported: true }, 'foo.com/qr-code/530?format=png' ],
      [ 'bar.io', 870, 'svg', { useSizeInPath: false, svgIsSupported: false }, 'bar.io/qr-code?size=870' ],
      [ 'bar.io', 200, 'png', { useSizeInPath: false, svgIsSupported: true }, 'bar.io/qr-code?size=200&format=png' ],
      [ 'bar.io', 200, 'svg', { useSizeInPath: false, svgIsSupported: true }, 'bar.io/qr-code?size=200&format=svg' ],
      [ 'foo.net', 480, 'png', { useSizeInPath: true, svgIsSupported: false }, 'foo.net/qr-code/480' ],
      [ 'foo.net', 480, 'svg', { useSizeInPath: true, svgIsSupported: false }, 'foo.net/qr-code/480' ],
    ])('builds expected URL based in params', (shortUrl, size, format, capabilities, expectedUrl) => {
      expect(buildQrCodeUrl(shortUrl, size, format as QrCodeFormat, capabilities)).toEqual(expectedUrl);
    });
  });
});
