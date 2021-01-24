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
  const joinSymbol = useSizeInPath && svgIsSupported ? '?' : !useSizeInPath && svgIsSupported ? '&' : '';

  return `${shortUrl}/qr-code${sizeFragment}${joinSymbol}${formatFragment}`;
};
