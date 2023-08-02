import { parseQuery, stringifyQuery } from '../../../src/utils/helpers/query';

describe('query', () => {
  describe('parseQuery', () => {
    it.each([
      ['', {}],
      ['foo=bar', { foo: 'bar' }],
      ['?foo=bar', { foo: 'bar' }],
      ['?foo=bar&baz=123', { foo: 'bar', baz: '123' }],
    ])('parses query string as expected', (queryString, expectedResult) => {
      expect(parseQuery(queryString)).toEqual(expectedResult);
    });
  });

  describe('stringifyQuery', () => {
    it.each([
      [{}, ''],
      [{ foo: 'bar' }, 'foo=bar'],
      [{ foo: 'bar', baz: '123' }, 'foo=bar&baz=123'],
      [{ bar: 'foo', list: ['one', 'two'] }, encodeURI('bar=foo&list[]=one&list[]=two')],
    ])('stringifies query as expected', (queryObj, expectedResult) => {
      expect(stringifyQuery(queryObj)).toEqual(expectedResult);
    });
  });
});
