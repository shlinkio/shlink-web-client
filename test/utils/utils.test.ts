import { capitalize, nonEmptyValueOrNull, rangeOf } from '../../src/utils/utils';
import { determineOrderDir } from '../../src/utils/helpers/ordering';

describe('utils', () => {
  describe('determineOrderDir', () => {
    it('returns ASC when current order field and selected field are different', () => {
      expect(determineOrderDir('foo', 'bar')).toEqual('ASC');
      expect(determineOrderDir('bar', 'foo')).toEqual('ASC');
    });

    it('returns ASC when no current order dir is provided', () => {
      expect(determineOrderDir('foo', 'foo')).toEqual('ASC');
      expect(determineOrderDir('bar', 'bar')).toEqual('ASC');
    });

    it('returns DESC when current order field and selected field are equal and current order dir is ASC', () => {
      expect(determineOrderDir('foo', 'foo', 'ASC')).toEqual('DESC');
      expect(determineOrderDir('bar', 'bar', 'ASC')).toEqual('DESC');
    });

    it('returns undefined when current order field and selected field are equal and current order dir is DESC', () => {
      expect(determineOrderDir('foo', 'foo', 'DESC')).toBeUndefined();
      expect(determineOrderDir('bar', 'bar', 'DESC')).toBeUndefined();
    });
  });

  describe('rangeOf', () => {
    const func = (i: number) => `result_${i}`;
    const size = 5;

    it('builds a range of specified size invike provided function', () => {
      expect(rangeOf(size, func)).toEqual([
        'result_1',
        'result_2',
        'result_3',
        'result_4',
        'result_5',
      ]);
    });

    it('builds a range starting at provided pos', () => {
      const startAt = 3;

      expect(rangeOf(size, func, startAt)).toEqual([
        'result_3',
        'result_4',
        'result_5',
      ]);
    });
  });

  describe('nonEmptyValueOrNull', () => {
    it.each([
      [ '', null ],
      [ 'Hello', 'Hello' ],
      [[], null ],
      [[ 1, 2, 3 ], [ 1, 2, 3 ]],
      [{}, null ],
      [{ foo: 'bar' }, { foo: 'bar' }],
    ])('returns expected value based on input', (value, expected) => {
      expect(nonEmptyValueOrNull(value)).toEqual(expected);
    });
  });

  describe('capitalize', () => {
    it.each([
      [ 'foo', 'Foo' ],
      [ 'BAR', 'BAR' ],
      [ 'bAZ', 'BAZ' ],
      [ 'with spaces', 'With spaces' ],
    ])('sets first letter in uppercase', (value, expectedResult) => {
      expect(capitalize(value)).toEqual(expectedResult);
    });
  });
});
