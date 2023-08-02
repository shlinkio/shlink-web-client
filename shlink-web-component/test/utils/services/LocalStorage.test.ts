import { fromPartial } from '@total-typescript/shoehorn';
import { LocalStorage } from '../../../src/utils/services/LocalStorage';

describe('LocalStorage', () => {
  const getItem = vi.fn((key) => (key === 'shlink.foo' ? JSON.stringify({ foo: 'bar' }) : null));
  const setItem = vi.fn();
  const localStorageMock = fromPartial<Storage>({ getItem, setItem });
  let storage: LocalStorage;

  beforeEach(() => {
    storage = new LocalStorage(localStorageMock);
  });

  describe('set', () => {
    it('writes an stringified representation of provided value in local storage', () => {
      const value = { bar: 'baz' };

      storage.set('foo', value);

      expect(setItem).toHaveBeenCalledTimes(1);
      expect(setItem).toHaveBeenCalledWith('shlink.foo', JSON.stringify(value));
    });
  });

  describe('get', () => {
    it('fetches item from local storage', () => {
      storage.get('foo');
      expect(getItem).toHaveBeenCalledTimes(1);
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
