import { evolveStringifiedQuery, parseQuery, stringifyQuery } from '../../../src/utils/helpers/query';

describe('query', () => {
  describe('parseQuery', () => {
    it.each([
      [ '', {}],
      [ 'foo=bar', { foo: 'bar' }],
      [ '?foo=bar', { foo: 'bar' }],
      [ '?foo=bar&baz=123', { foo: 'bar', baz: '123' }],
    ])('parses query string as expected', (queryString, expectedResult) => {
      expect(parseQuery(queryString)).toEqual(expectedResult);
    });
  });

  describe('stringifyQuery', () => {
    it.each([
      [{}, '' ],
      [{ foo: 'bar' }, 'foo=bar' ],
      [{ foo: 'bar', baz: '123' }, 'foo=bar&baz=123' ],
      [{ bar: 'foo', list: [ 'one', 'two' ] }, encodeURI('bar=foo&list[]=one&list[]=two') ],
    ])('stringifies query as expected', (queryObj, expectedResult) => {
      expect(stringifyQuery(queryObj)).toEqual(expectedResult);
    });
  });

  describe('evolveStringifiedQuery', () => {
    it.each([
      [ '?foo=bar', { baz: 123 }, 'foo=bar&baz=123' ],
      [ 'foo=bar', { baz: 123 }, 'foo=bar&baz=123' ],
      [ 'foo=bar&baz=hello', { baz: 'world' }, 'foo=bar&baz=world' ],
      [ '?', { foo: 'some', bar: 'thing' }, 'foo=some&bar=thing' ],
    ])('adds and overwrites params on provided query string', (query, extra, expected) => {
      expect(evolveStringifiedQuery(query, extra)).toEqual(expected);
    });
  });
});
