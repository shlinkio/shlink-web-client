import { capitalize, nonEmptyValueOrNull, rangeOf } from '../../src/utils/utils';

describe('utils', () => {
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
      ['', null],
      ['Hello', 'Hello'],
      [[], null],
      [[1, 2, 3], [1, 2, 3]],
      [{}, null],
      [{ foo: 'bar' }, { foo: 'bar' }],
    ])('returns expected value based on input', (value, expected) => {
      expect(nonEmptyValueOrNull(value)).toEqual(expected);
    });
  });

  describe('capitalize', () => {
    it.each([
      ['foo', 'Foo'],
      ['BAR', 'BAR'],
      ['bAZ', 'BAZ'],
      ['with spaces', 'With spaces'],
    ])('sets first letter in uppercase', (value, expectedResult) => {
      expect(capitalize(value)).toEqual(expectedResult);
    });
  });
});
