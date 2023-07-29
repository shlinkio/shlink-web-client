import {
  nonEmptyValueOrNull,
  parseBooleanToString,
  parseOptionalBooleanToString,
  rangeOf,
} from '../../src/utils/utils';

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

  describe('parseBooleanToString', () => {
    it.each([
      [true, 'true'],
      [false, 'false'],
    ])('parses value as expected', (value, expectedResult) => {
      expect(parseBooleanToString(value)).toEqual(expectedResult);
    });
  });

  describe('parseOptionalBooleanToString', () => {
    it.each([
      [undefined, undefined],
      [true, 'true'],
      [false, 'false'],
    ])('parses value as expected', (value, expectedResult) => {
      expect(parseOptionalBooleanToString(value)).toEqual(expectedResult);
    });
  });
});
