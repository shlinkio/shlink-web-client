import { addDays, formatISO, subDays } from 'date-fns';
import { formatDate, formatIsoDate, isBeforeOrEqual, isBetween, parseDate } from '../../../src/utils/helpers/date';

describe('date', () => {
  const now = new Date();

  describe('formatDate', () => {
    it.each([
      [parseDate('2020-03-05 10:00:10', 'yyyy-MM-dd HH:mm:ss'), 'dd/MM/yyyy', '05/03/2020'],
      [parseDate('2020-03-05 10:00:10', 'yyyy-MM-dd HH:mm:ss'), 'yyyy-MM', '2020-03'],
      [parseDate('2020-03-05 10:00:10', 'yyyy-MM-dd HH:mm:ss'), undefined, '2020-03-05'],
      ['2020-03-05 10:00:10', 'dd-MM-yyyy', '2020-03-05 10:00:10'],
      ['2020-03-05 10:00:10', undefined, '2020-03-05 10:00:10'],
      [undefined, undefined, undefined],
      [null, undefined, null],
    ])('formats date as expected', (date, format, expected) => {
      expect(formatDate(format)(date)).toEqual(expected);
    });
  });

  describe('formatIsoDate', () => {
    it.each([
      [
        parseDate('2020-03-05 10:00:10', 'yyyy-MM-dd HH:mm:ss'),
        formatISO(parseDate('2020-03-05 10:00:10', 'yyyy-MM-dd HH:mm:ss')),
      ],
      ['2020-03-05 10:00:10', '2020-03-05 10:00:10'],
      ['foo', 'foo'],
      [undefined, undefined],
      [null, null],
    ])('formats date as expected', (date, expected) => {
      expect(formatIsoDate(date)).toEqual(expected);
    });
  });

  describe('isBetween', () => {
    it.each([
      [now, undefined, undefined, true],
      [now, subDays(now, 1), undefined, true],
      [now, now, undefined, true],
      [now, undefined, addDays(now, 1), true],
      [now, undefined, now, true],
      [now, subDays(now, 1), addDays(now, 1), true],
      [now, now, now, true],
      [now, addDays(now, 1), undefined, false],
      [now, undefined, subDays(now, 1), false],
      [now, subDays(now, 3), subDays(now, 1), false],
      [now, addDays(now, 1), addDays(now, 3), false],
    ])('returns true when a date is between provided range', (date, start, end, expectedResult) => {
      expect(isBetween(date, start, end)).toEqual(expectedResult);
    });
  });

  describe('isBeforeOrEqual', () => {
    it.each([
      [now, now, true],
      [now, addDays(now, 1), true],
      [now, subDays(now, 1), false],
    ])('returns true when the date before or equal to provided one', (date, dateToCompare, expectedResult) => {
      expect(isBeforeOrEqual(date, dateToCompare)).toEqual(expectedResult);
    });
  });
});
