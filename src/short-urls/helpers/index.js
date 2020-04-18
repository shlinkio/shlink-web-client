import { isNil } from 'ramda';

export const shortUrlMatches = (shortUrl, shortCode, domain) => {
  if (isNil(domain)) {
    return shortUrl.shortCode === shortCode && !shortUrl.domain;
  }

  return shortUrl.shortCode === shortCode && shortUrl.domain === domain;
};
