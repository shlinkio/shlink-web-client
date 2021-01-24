import { always, cond } from 'ramda';

export interface QrCodeCapabilities {
  useSizeInPath: boolean;
  svgIsSupported: boolean;
}

export type QrCodeFormat = 'svg' | 'png';

export const buildQrCodeUrl = (
  shortUrl: string,
  size: number,
  format: QrCodeFormat,
  { useSizeInPath, svgIsSupported }: QrCodeCapabilities,
): string => {
  const sizeFragment = useSizeInPath ? `/${size}` : `?size=${size}`;
  const formatFragment = !svgIsSupported ? '' : `format=${format}`;
  const joinSymbolResolver = cond([
    [ () => useSizeInPath && svgIsSupported, always('?') ],
    [ () => !useSizeInPath && svgIsSupported, always('&') ],
  ]);
  const joinSymbol = joinSymbolResolver() ?? '';

  return `${shortUrl}/qr-code${sizeFragment}${joinSymbol}${formatFragment}`;
};
