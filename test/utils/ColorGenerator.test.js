import * as sinon from 'sinon';
import { ColorGenerator } from '../../src/utils/ColorGenerator';

describe('ColorGenerator', () => {
  let colorGenerator;
  const storageMock = {
    set: sinon.fake(),
    get: sinon.fake.returns(undefined),
  };

  beforeEach(() => {
    storageMock.set.resetHistory();
    storageMock.get.resetHistory();

    colorGenerator = new ColorGenerator(storageMock);
  });

  it('sets a color in the storage and makes it available after that', () => {
    const color = '#ff0000';

    colorGenerator.setColorForKey('foo', color);

    expect(colorGenerator.getColorForKey('foo')).toEqual(color);
    expect(storageMock.set.callCount).toEqual(1);
    expect(storageMock.get.callCount).toEqual(1);
  });

  it('generates a random color when none is available for requested key', () => {
    expect(colorGenerator.getColorForKey('bar')).toEqual(expect.stringMatching(/^#(?:[0-9a-fA-F]{6})$/));
    expect(storageMock.set.callCount).toEqual(1);
    expect(storageMock.get.callCount).toEqual(1);
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
    expect(storageMock.set.callCount).toEqual(1);
    expect(storageMock.get.callCount).toEqual(1);
  });
});
