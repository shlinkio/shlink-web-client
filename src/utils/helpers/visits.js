import bowser from 'bowser';
import { hasValue } from '../utils';

const DEFAULT = 'Others';
const BROWSERS_WHITELIST = [
  'Android Browser',
  'Chrome',
  'Chromium',
  'Firefox',
  'Internet Explorer',
  'Microsoft Edge',
  'Opera',
  'Safari',
  'Samsung Internet for Android',
  'Vivaldi',
  'WeChat',
];

export const osFromUserAgent = (userAgent) => {
  if (!hasValue(userAgent)) {
    return DEFAULT;
  }

  return bowser.parse(userAgent).os.name || DEFAULT;
};

export const browserFromUserAgent = (userAgent) => {
  if (!hasValue(userAgent)) {
    return DEFAULT;
  }

  const { name: browser } = bowser.parse(userAgent).browser;

  return browser && BROWSERS_WHITELIST.includes(browser) ? browser : DEFAULT;
};

export const extractDomain = (url) => {
  if (!hasValue(url)) {
    return 'Direct';
  }

  const domain = url.includes('://') ? url.split('/')[2] : url.split('/')[0];

  return domain.split(':')[0];
};
