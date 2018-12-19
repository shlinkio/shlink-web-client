import * as sinon from 'sinon';
import Storage from '../../../src/utils/services/Storage';

describe('Storage', () => {
  const localStorageMock = {
    getItem: sinon.fake((key) => key === 'shlink.foo' ? JSON.stringify({ foo: 'bar' }) : null),
    setItem: sinon.spy(),
  };
  let storage;

  beforeEach(() => {
    localStorageMock.getItem.resetHistory();
    localStorageMock.setItem.resetHistory();

    storage = new Storage(localStorageMock);
  });

  describe('set', () => {
    it('writes an stringified representation of provided value in local storage', () => {
      const value = { bar: 'baz' };

      storage.set('foo', value);

      expect(localStorageMock.setItem.callCount).toEqual(1);
      expect(localStorageMock.setItem.getCall(0).args).toEqual([
        'shlink.foo',
        JSON.stringify(value),
      ]);
    });
  });

  describe('get', () => {
    it('fetches item from local storage', () => {
      storage.get('foo');
      expect(localStorageMock.getItem.callCount).toEqual(1);
    });

    it('returns parsed value when requested value is found in local storage', () => {
      const value = storage.get('foo');

      expect(value).toEqual({ foo: 'bar' });
    });

    it('returns undefined when requested value is not found in local storage', () => {
      const value = storage.get('bar');

      expect(value).toBeUndefined();
    });
  });
});
