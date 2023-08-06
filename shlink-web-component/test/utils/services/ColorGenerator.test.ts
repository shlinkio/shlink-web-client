import { MAIN_COLOR } from '@shlinkio/shlink-frontend-kit';
import { fromPartial } from '@total-typescript/shoehorn';
import { ColorGenerator } from '../../../src/utils/services/ColorGenerator';
import type { TagColorsStorage } from '../../../src/utils/services/TagColorsStorage';

describe('ColorGenerator', () => {
  let colorGenerator: ColorGenerator;
  const storageMock = fromPartial<TagColorsStorage>({
    storeTagColors: vi.fn(),
    getTagColors: vi.fn().mockImplementation(() => ({})),
  });

  beforeEach(() => {
    colorGenerator = new ColorGenerator(storageMock);
  });

  it('sets a color in the storage and makes it available after that', () => {
    const color = '#ff0000';

    colorGenerator.setColorForKey('foo', color);

    expect(colorGenerator.getColorForKey('foo')).toEqual(color);
    expect(storageMock.storeTagColors).toHaveBeenCalledTimes(1);
    expect(storageMock.getTagColors).toHaveBeenCalledTimes(1);
  });

  it('generates a random color when none is available for requested key', () => {
    expect(colorGenerator.getColorForKey('bar')).toEqual(expect.stringMatching(/^#(?:[0-9a-fA-F]{6})$/));
    expect(storageMock.storeTagColors).toHaveBeenCalledTimes(1);
    expect(storageMock.getTagColors).toHaveBeenCalledTimes(1);
  });

  it('trims and lower cases keys before trying to match', () => {
    const color = '#ff0000';

    colorGenerator.setColorForKey('foo', color);

    expect(colorGenerator.getColorForKey('  foo')).toEqual(color);
    expect(colorGenerator.getColorForKey('foO')).toEqual(color);
    expect(colorGenerator.getColorForKey('FoO')).toEqual(color);
    expect(colorGenerator.getColorForKey('FOO')).toEqual(color);
    expect(colorGenerator.getColorForKey('FOO  ')).toEqual(color);
    expect(colorGenerator.getColorForKey(' FoO  ')).toEqual(color);
    expect(storageMock.storeTagColors).toHaveBeenCalledTimes(1);
    expect(storageMock.getTagColors).toHaveBeenCalledTimes(1);
  });

  describe('isColorLightForKey', () => {
    it.each([
      [MAIN_COLOR, true],
      ['#8A661C', false],
      ['#F7BE05', true],
      ['#5A02D8', false],
      ['#202786', false],
    ])('returns that the color for a key is light based on the color assigned to that key', (color, isLight) => {
      colorGenerator.setColorForKey('foo', color);

      expect(isLight).toEqual(colorGenerator.isColorLightForKey('foo'));
      expect(isLight).toEqual(colorGenerator.isColorLightForKey('foo')); // To cover when color is already calculated
    });
  });
});
