import { Mock } from 'ts-mockery';
import { ShortUrl } from '../../../src/short-urls/data';
import { shortUrlDataFromShortUrl } from '../../../src/short-urls/helpers';

describe('helpers', () => {
  describe('shortUrlDataFromShortUrl', () => {
    it.each([
      [undefined, { validateUrls: true }, { longUrl: '', validateUrl: true }],
      [undefined, undefined, { longUrl: '', validateUrl: false }],
      [
        Mock.of<ShortUrl>({ meta: {} }),
        { validateUrls: false },
        {
          longUrl: undefined,
          tags: undefined,
          title: undefined,
          domain: undefined,
          validSince: undefined,
          validUntil: undefined,
          maxVisits: undefined,
          validateUrl: false,
        },
      ],
    ])('returns expected data', (shortUrl, settings, expectedInitialState) => {
      expect(shortUrlDataFromShortUrl(shortUrl, settings)).toEqual(expectedInitialState);
    });
  });
});
