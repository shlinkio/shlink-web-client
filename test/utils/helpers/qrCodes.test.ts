import { buildQrCodeUrl, QrCodeFormat, QrErrorCorrection } from '../../../src/utils/helpers/qrCodes';

describe('qrCodes', () => {
  describe('buildQrCodeUrl', () => {
    test.each([
      [
        'foo.com',
        { size: 530, format: 'svg' as QrCodeFormat, margin: 0, errorCorrection: 'L' as QrErrorCorrection },
        { useSizeInPath: true, svgIsSupported: true, marginIsSupported: false, errorCorrectionIsSupported: false },
        'foo.com/qr-code/530?format=svg',
      ],
      [
        'foo.com',
        { size: 530, format: 'png' as QrCodeFormat, margin: 0, errorCorrection: 'L' as QrErrorCorrection },
        { useSizeInPath: true, svgIsSupported: true, marginIsSupported: false, errorCorrectionIsSupported: false },
        'foo.com/qr-code/530?format=png',
      ],
      [
        'bar.io',
        { size: 870, format: 'svg' as QrCodeFormat, margin: 0, errorCorrection: 'L' as QrErrorCorrection },
        { useSizeInPath: false, svgIsSupported: false, marginIsSupported: false, errorCorrectionIsSupported: false },
        'bar.io/qr-code?size=870',
      ],
      [
        'bar.io',
        { size: 200, format: 'png' as QrCodeFormat, margin: 0, errorCorrection: 'L' as QrErrorCorrection },
        { useSizeInPath: false, svgIsSupported: true, marginIsSupported: false, errorCorrectionIsSupported: false },
        'bar.io/qr-code?size=200&format=png',
      ],
      [
        'bar.io',
        { size: 200, format: 'svg' as QrCodeFormat, margin: 0, errorCorrection: 'L' as QrErrorCorrection },
        { useSizeInPath: false, svgIsSupported: true, marginIsSupported: false, errorCorrectionIsSupported: false },
        'bar.io/qr-code?size=200&format=svg',
      ],
      [
        'foo.net',
        { size: 480, format: 'png' as QrCodeFormat, margin: 0, errorCorrection: 'L' as QrErrorCorrection },
        { useSizeInPath: true, svgIsSupported: false, marginIsSupported: false, errorCorrectionIsSupported: false },
        'foo.net/qr-code/480',
      ],
      [
        'foo.net',
        { size: 480, format: 'svg' as QrCodeFormat, margin: 0, errorCorrection: 'L' as QrErrorCorrection },
        { useSizeInPath: true, svgIsSupported: false, marginIsSupported: false, errorCorrectionIsSupported: false },
        'foo.net/qr-code/480',
      ],
      [
        'shlink.io',
        { size: 123, format: 'svg' as QrCodeFormat, margin: 10, errorCorrection: 'L' as QrErrorCorrection },
        { useSizeInPath: true, svgIsSupported: false, marginIsSupported: false, errorCorrectionIsSupported: false },
        'shlink.io/qr-code/123',
      ],
      [
        'shlink.io',
        { size: 456, format: 'png' as QrCodeFormat, margin: 10, errorCorrection: 'L' as QrErrorCorrection },
        { useSizeInPath: true, svgIsSupported: true, marginIsSupported: true, errorCorrectionIsSupported: false },
        'shlink.io/qr-code/456?format=png&margin=10',
      ],
      [
        'shlink.io',
        { size: 456, format: 'png' as QrCodeFormat, margin: 0, errorCorrection: 'L' as QrErrorCorrection },
        { useSizeInPath: true, svgIsSupported: true, marginIsSupported: true, errorCorrectionIsSupported: false },
        'shlink.io/qr-code/456?format=png',
      ],
      [
        'shlink.io',
        { size: 456, format: 'png' as QrCodeFormat, margin: 0, errorCorrection: 'H' as QrErrorCorrection },
        { useSizeInPath: true, svgIsSupported: true, marginIsSupported: true, errorCorrectionIsSupported: true },
        'shlink.io/qr-code/456?format=png&errorCorrection=H',
      ],
    ])('builds expected URL based in params', (shortUrl, options, capabilities, expectedUrl) => {
      expect(buildQrCodeUrl(shortUrl, options, capabilities)).toEqual(expectedUrl);
    });
  });
});
