import { stringifyQuery } from '@shlinkio/shlink-frontend-kit';
import { isEmpty } from 'ramda';

export type QrCodeFormat = 'svg' | 'png';

export type QrErrorCorrection = 'L' | 'M' | 'Q' | 'H';

export interface QrCodeOptions {
  size: number;
  format: QrCodeFormat;
  margin: number;
  errorCorrection: QrErrorCorrection;
}

export const buildQrCodeUrl = (shortUrl: string, { margin, ...options }: QrCodeOptions): string => {
  const baseUrl = `${shortUrl}/qr-code`;
  const query = stringifyQuery({
    ...options,
    margin: margin > 0 ? margin : undefined,
  });

  return `${baseUrl}${isEmpty(query) ? '' : `?${query}`}`;
};
