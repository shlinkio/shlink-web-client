import { isEmpty } from 'ramda';
import { stringifyQuery } from './query';

export interface QrCodeCapabilities {
  useSizeInPath: boolean;
  marginIsSupported: boolean;
  errorCorrectionIsSupported: boolean;
}

export type QrCodeFormat = 'svg' | 'png';

export type QrErrorCorrection = 'L' | 'M' | 'Q' | 'H';

export interface QrCodeOptions {
  size: number;
  format: QrCodeFormat;
  margin: number;
  errorCorrection: QrErrorCorrection;
}

export const buildQrCodeUrl = (
  shortUrl: string,
  { size, format, margin, errorCorrection }: QrCodeOptions,
  { useSizeInPath, marginIsSupported, errorCorrectionIsSupported }: QrCodeCapabilities,
): string => {
  const baseUrl = `${shortUrl}/qr-code${useSizeInPath ? `/${size}` : ''}`;
  const query = stringifyQuery({
    size: useSizeInPath ? undefined : size,
    format,
    margin: marginIsSupported && margin > 0 ? margin : undefined,
    errorCorrection: errorCorrectionIsSupported ? errorCorrection : undefined,
  });

  return `${baseUrl}${isEmpty(query) ? '' : `?${query}`}`;
};
