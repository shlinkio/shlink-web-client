import type { QrCodeFormat, QrErrorCorrection } from '../../../shlink-web-component/utils/helpers/qrCodes';
import { buildQrCodeUrl } from '../../../shlink-web-component/utils/helpers/qrCodes';

describe('qrCodes', () => {
  describe('buildQrCodeUrl', () => {
    it.each([
      [
        'bar.io',
        { size: 870, format: 'svg' as QrCodeFormat, margin: 0, errorCorrection: 'L' as QrErrorCorrection },
        'bar.io/qr-code?size=870&format=svg&errorCorrection=L',
      ],
      [
        'bar.io',
        { size: 200, format: 'svg' as QrCodeFormat, margin: 0, errorCorrection: 'L' as QrErrorCorrection },
        'bar.io/qr-code?size=200&format=svg&errorCorrection=L',
      ],
      [
        'shlink.io',
        { size: 456, format: 'png' as QrCodeFormat, margin: 10, errorCorrection: 'L' as QrErrorCorrection },
        'shlink.io/qr-code?size=456&format=png&errorCorrection=L&margin=10',
      ],
      [
        'shlink.io',
        { size: 456, format: 'png' as QrCodeFormat, margin: 0, errorCorrection: 'H' as QrErrorCorrection },
        'shlink.io/qr-code?size=456&format=png&errorCorrection=H',
      ],
      [
        'shlink.io',
        { size: 999, format: 'png' as QrCodeFormat, margin: 20, errorCorrection: 'Q' as QrErrorCorrection },
        'shlink.io/qr-code?size=999&format=png&errorCorrection=Q&margin=20',
      ],
    ])('builds expected URL based in params', (shortUrl, options, expectedUrl) => {
      expect(buildQrCodeUrl(shortUrl, options)).toEqual(expectedUrl);
    });
  });
});
