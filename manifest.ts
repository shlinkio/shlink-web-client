import { BRAND_COLOR_LM } from '@shlinkio/shlink-frontend-kit';
import type { ManifestOptions } from 'vite-plugin-pwa';

const iconSizes = [
  '16',
  '24',
  '32',
  '40',
  '48',
  '60',
  '64',
  '72',
  '76',
  '96',
  '114',
  '120',
  '128',
  '144',
  '150',
  '152',
  '160',
  '167',
  '180',
  '192',
  '196',
  '228',
  '256',
  '310',
  '384',
  '512',
  '1024',
];

export const manifest: Partial<ManifestOptions> = {
  short_name: 'Shlink',
  name: 'Shlink Web Client',
  start_url: '/',
  display: 'standalone',
  theme_color: BRAND_COLOR_LM, // Toolbar color
  background_color: BRAND_COLOR_LM, // Splash screen background color
  icons: iconSizes.map((size) => ({
    src: `./icons/icon-${size}x${size}.png`,
    type: 'image/png',
    sizes: `${size}x${size}`,
  })),
};
