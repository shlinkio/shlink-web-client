import { hasValue } from '../utils';

const DEFAULT = 'Others';

export const osFromUserAgent = (userAgent) => {
  if (!hasValue(userAgent)) {
    return DEFAULT;
  }

  const lowerUserAgent = userAgent.toLowerCase();

  switch (true) {
    case lowerUserAgent.includes('linux'):
      return 'Linux';
    case lowerUserAgent.includes('windows'):
      return 'Windows';
    case lowerUserAgent.includes('mac'):
      return 'MacOS';
    case lowerUserAgent.includes('mobi'):
      return 'Mobile';
    default:
      return DEFAULT;
  }
};

export const browserFromUserAgent = (userAgent) => {
  if (!hasValue(userAgent)) {
    return DEFAULT;
  }

  const lowerUserAgent = userAgent.toLowerCase();

  switch (true) {
    case lowerUserAgent.includes('opera') || lowerUserAgent.includes('opr'):
      return 'Opera';
    case lowerUserAgent.includes('firefox'):
      return 'Firefox';
    case lowerUserAgent.includes('chrome'):
      return 'Chrome';
    case lowerUserAgent.includes('safari'):
      return 'Safari';
    case lowerUserAgent.includes('edg'):
      return 'Microsoft Edge';
    case lowerUserAgent.includes('msie'):
      return 'Internet Explorer';
    default:
      return DEFAULT;
  }
};

export const extractDomain = (url) => {
  if (!hasValue(url)) {
    return 'Direct';
  }

  const domain = url.includes('://') ? url.split('/')[2] : url.split('/')[0];

  return domain.split(':')[0];
};
