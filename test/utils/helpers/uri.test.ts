import { replaceAuthorityFromUri } from '../../../src/utils/helpers/uri';

describe('uri-helper', () => {
  describe('replaceAuthorityFromUri', () => {
    it.each([
      ['http://something.com/foo/bar', 'www.new.to', 'http://www.new.to/foo/bar'],
      ['https://www.authori.ty:8000/', 'doma.in', 'https://doma.in/'],
      ['http://localhost:8080/this/is-a-long/path', 'somewhere:8888', 'http://somewhere:8888/this/is-a-long/path'],
    ])('replaces authority as expected', (uri, newAuthority, expectedResult) => {
      expect(replaceAuthorityFromUri(uri, newAuthority)).toEqual(expectedResult);
    });
  });
});
