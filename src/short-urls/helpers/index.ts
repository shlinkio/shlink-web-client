import { isNil } from 'ramda';
import { ShortUrl } from '../data';
import { OptionalString } from '../../utils/utils';
import { DEFAULT_DOMAIN } from '../../visits/reducers/domainVisits';

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
