import ColorGenerator from '../../../src/utils/services/ColorGenerator';

describe('ColorGenerator', () => {
  let colorGenerator;
  const storageMock = {
    set: jest.fn(),
    get: jest.fn(),
  };

  beforeEach(() => {
    storageMock.set.mockReset();
    storageMock.get.mockReset();

    colorGenerator = new ColorGenerator(storageMock);
  });

  it('sets a color in the storage and makes it available after that', () => {
    const color = '#ff0000';

    colorGenerator.setColorForKey('foo', color);

    expect(colorGenerator.getColorForKey('foo')).toEqual(color);
    expect(storageMock.set).toHaveBeenCalledTimes(1);
    expect(storageMock.get).toHaveBeenCalledTimes(1);
  });

  it('generates a random color when none is available for requested key', () => {
    expect(colorGenerator.getColorForKey('bar')).toEqual(expect.stringMatching(/^#(?:[0-9a-fA-F]{6})$/));
    expect(storageMock.set).toHaveBeenCalledTimes(1);
    expect(storageMock.get).toHaveBeenCalledTimes(1);
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
    expect(storageMock.set).toHaveBeenCalledTimes(1);
    expect(storageMock.get).toHaveBeenCalledTimes(1);
  });
});
