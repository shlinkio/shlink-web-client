import { isEmpty } from 'ramda';
import { stringifyQuery } from './query';

export interface QrCodeCapabilities {
  useSizeInPath: boolean;
  svgIsSupported: boolean;
  marginIsSupported: boolean;
}

export type QrCodeFormat = 'svg' | 'png';

export interface QrCodeOptions {
  size: number;
  format: QrCodeFormat;
  margin: number;
}

export const buildQrCodeUrl = (
  shortUrl: string,
  { size, format, margin }: QrCodeOptions,
  { useSizeInPath, svgIsSupported, marginIsSupported }: QrCodeCapabilities,
): string => {
  const baseUrl = `${shortUrl}/qr-code${useSizeInPath ? `/${size}` : ''}`;
  const query = stringifyQuery({
    size: useSizeInPath ? undefined : size,
    format: svgIsSupported ? format : undefined,
    margin: marginIsSupported && margin > 0 ? margin : undefined,
  });

  return `${baseUrl}${isEmpty(query) ? '' : `?${query}`}`;
};
