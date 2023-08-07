import { fromPartial } from '@total-typescript/shoehorn';
import type { LocalStorage } from '../../../src/utils/services/LocalStorage';
import { TagColorsStorage } from '../../../src/utils/services/TagColorsStorage';

describe('TagColorsStorage', () => {
  const get = vi.fn();
  const set = vi.fn();
  const localStorage = fromPartial<LocalStorage>({ get, set });
  let tagColorsStorage: TagColorsStorage;

  beforeEach(() => {
    tagColorsStorage = new TagColorsStorage(localStorage);
  });

  describe('getTagColors', () => {
    it.each([
      [undefined, {}],
      [{ foo: 'red', var: 'green' }, { foo: 'red', var: 'green' }],
    ])('returns colors from local storage', (colorsFromStorage, expectedValue) => {
      get.mockReturnValue(colorsFromStorage);

      expect(tagColorsStorage.getTagColors()).toEqual(expectedValue);
      expect(get).toHaveBeenCalledOnce();
    });
  });

  describe('storeTagColors', () => {
    it('stores provied colors', () => {
      const colors = { foo: 'red' };

      tagColorsStorage.storeTagColors(colors);

      expect(set).toHaveBeenCalledWith('colors', colors);
    });
  });
});
