import { fromPartial } from '@total-typescript/shoehorn';
import type { ShortUrl } from '../../../shlink-web-component/src/short-urls/data';
import { shortUrlDataFromShortUrl, urlDecodeShortCode, urlEncodeShortCode } from '../../../shlink-web-component/src/short-urls/helpers';

describe('helpers', () => {
  describe('shortUrlDataFromShortUrl', () => {
    it.each([
      [undefined, { validateUrls: true }, { longUrl: '', validateUrl: true }],
      [undefined, undefined, { longUrl: '', validateUrl: false }],
      [
        fromPartial<ShortUrl>({ meta: {} }),
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

  describe('urlEncodeShortCode', () => {
    it.each([
      ['foo', 'foo'],
      ['foo/bar', 'foo__bar'],
      ['foo/bar/baz', 'foo__bar__baz'],
    ])('parses shortCode as expected', (shortCode, result) => {
      expect(urlEncodeShortCode(shortCode)).toEqual(result);
    });
  });

  describe('urlDecodeShortCode', () => {
    it.each([
      ['foo', 'foo'],
      ['foo__bar', 'foo/bar'],
      ['foo__bar__baz', 'foo/bar/baz'],
    ])('parses shortCode as expected', (shortCode, result) => {
      expect(urlDecodeShortCode(shortCode)).toEqual(result);
    });
  });
});
