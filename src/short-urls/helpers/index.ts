import { isNil } from 'ramda';
import { ShortUrl, ShortUrlData } from '../data';
import { OptionalString } from '../../utils/utils';
import { DEFAULT_DOMAIN } from '../../visits/reducers/domainVisits';
import { ShortUrlCreationSettings } from '../../settings/reducers/settings';
import { isBefore, parseISO } from 'date-fns';
import { now } from '../../utils/helpers/date';

export const shortUrlMatches = (shortUrl: ShortUrl, shortCode: string, domain: OptionalString): boolean => {
  if (isNil(domain)) {
    return shortUrl.shortCode === shortCode && !shortUrl.domain;
  }

  return shortUrl.shortCode === shortCode && shortUrl.domain === domain;
};

export const domainMatches = (shortUrl: ShortUrl, domain: string): boolean => {
  if (!shortUrl.domain && domain === DEFAULT_DOMAIN) {
    return true;
  }

  return shortUrl.domain === domain;
};

export const shortUrlIsDisabled = (shortUrl: ShortUrl): boolean => (
  !!shortUrl.meta.maxVisits && shortUrl.visitsCount >= shortUrl.meta.maxVisits
) || (
  !!shortUrl.meta.validSince && isBefore(now(), parseISO(shortUrl.meta.validSince))
) || (
  !!shortUrl.meta.validUntil && isBefore(parseISO(shortUrl.meta.validUntil), now())
);

export const shortUrlDataFromShortUrl = (shortUrl?: ShortUrl, settings?: ShortUrlCreationSettings): ShortUrlData => {
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
    validateUrl,
  };
};

const MULTI_SEGMENT_SEPARATOR = '__';

export const urlEncodeShortCode = (shortCode: string): string => shortCode.replaceAll('/', MULTI_SEGMENT_SEPARATOR);

export const urlDecodeShortCode = (shortCode: string): string => shortCode.replaceAll(MULTI_SEGMENT_SEPARATOR, '/');
