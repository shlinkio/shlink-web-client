import { isNil } from 'ramda';
import type { ShlinkShortUrl } from '../../api-contract';
import type { OptionalString } from '../../utils/helpers';
import type { ShortUrlCreationSettings } from '../../utils/settings';
import { DEFAULT_DOMAIN } from '../../visits/reducers/domainVisits';
import type { ShortUrlData } from '../data';

export const shortUrlMatches = (shortUrl: ShlinkShortUrl, shortCode: string, domain: OptionalString): boolean => {
  if (isNil(domain)) {
    return shortUrl.shortCode === shortCode && !shortUrl.domain;
  }

  return shortUrl.shortCode === shortCode && shortUrl.domain === domain;
};

export const domainMatches = (shortUrl: ShlinkShortUrl, domain: string): boolean => {
  if (!shortUrl.domain && domain === DEFAULT_DOMAIN) {
    return true;
  }

  return shortUrl.domain === domain;
};

export const shortUrlDataFromShortUrl = (
  shortUrl?: ShlinkShortUrl,
  settings?: ShortUrlCreationSettings,
): ShortUrlData => {
  const validateUrl = settings?.validateUrls ?? false;

  if (!shortUrl) {
    return { longUrl: '', validateUrl };
  }

  return {
    longUrl: shortUrl.longUrl,
    tags: shortUrl.tags,
    title: shortUrl.title ?? undefined,
    domain: shortUrl.domain ?? undefined,
    validSince: shortUrl.meta.validSince ?? undefined,
    validUntil: shortUrl.meta.validUntil ?? undefined,
    maxVisits: shortUrl.meta.maxVisits ?? undefined,
    crawlable: shortUrl.crawlable,
    forwardQuery: shortUrl.forwardQuery,
    deviceLongUrls: shortUrl.deviceLongUrls && {
      android: shortUrl.deviceLongUrls.android ?? undefined,
      ios: shortUrl.deviceLongUrls.ios ?? undefined,
      desktop: shortUrl.deviceLongUrls.desktop ?? undefined,
    },
    validateUrl,
  };
};

const MULTI_SEGMENT_SEPARATOR = '__';

export const urlEncodeShortCode = (shortCode: string): string => shortCode.replaceAll('/', MULTI_SEGMENT_SEPARATOR);

export const urlDecodeShortCode = (shortCode: string): string => shortCode.replaceAll(MULTI_SEGMENT_SEPARATOR, '/');
