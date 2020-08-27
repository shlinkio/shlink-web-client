import { isNil } from 'ramda';
import { ShortUrl } from '../data';
import { OptionalString } from '../../utils/utils';

export const shortUrlMatches = (shortUrl: ShortUrl, shortCode: string, domain: OptionalString): boolean => {
  if (isNil(domain)) {
    return shortUrl.shortCode === shortCode && !shortUrl.domain;
  }

  return shortUrl.shortCode === shortCode && shortUrl.domain === domain;
};
