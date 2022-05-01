import { buildQrCodeUrl, QrCodeFormat, QrErrorCorrection } from '../../../src/utils/helpers/qrCodes';

describe('qrCodes', () => {
  describe('buildQrCodeUrl', () => {
    it.each([
      [
        'bar.io',
        { size: 870, format: 'svg' as QrCodeFormat, margin: 0, errorCorrection: 'L' as QrErrorCorrection },
        { errorCorrectionIsSupported: false },
        'bar.io/qr-code?size=870&format=svg',
      ],
      [
        'bar.io',
        { size: 200, format: 'png' as QrCodeFormat, margin: 0, errorCorrection: 'L' as QrErrorCorrection },
        { errorCorrectionIsSupported: false },
        'bar.io/qr-code?size=200&format=png',
      ],
      [
        'bar.io',
        { size: 200, format: 'svg' as QrCodeFormat, margin: 0, errorCorrection: 'L' as QrErrorCorrection },
        { errorCorrectionIsSupported: false },
        'bar.io/qr-code?size=200&format=svg',
      ],
      [
        'shlink.io',
        { size: 456, format: 'png' as QrCodeFormat, margin: 10, errorCorrection: 'L' as QrErrorCorrection },
        { errorCorrectionIsSupported: false },
        'shlink.io/qr-code?size=456&format=png&margin=10',
      ],
      [
        'shlink.io',
        { size: 456, format: 'png' as QrCodeFormat, margin: 0, errorCorrection: 'H' as QrErrorCorrection },
        { errorCorrectionIsSupported: true },
        'shlink.io/qr-code?size=456&format=png&errorCorrection=H',
      ],
      [
        'shlink.io',
        { size: 999, format: 'png' as QrCodeFormat, margin: 20, errorCorrection: 'Q' as QrErrorCorrection },
        { errorCorrectionIsSupported: true },
        'shlink.io/qr-code?size=999&format=png&margin=20&errorCorrection=Q',
      ],
    ])('builds expected URL based in params', (shortUrl, options, capabilities, expectedUrl) => {
      expect(buildQrCodeUrl(shortUrl, options, capabilities)).toEqual(expectedUrl);
    });
  });
});
