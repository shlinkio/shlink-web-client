import { endOfDay, format, formatISO, startOfDay, subDays } from 'date-fns';
import {
  DateInterval,
  dateRangeIsEmpty,
  dateToMatchingInterval,
  intervalToDateRange,
  rangeIsInterval,
  rangeOrIntervalToString,
} from '../../../../src/utils/dates/types';
import { parseDate } from '../../../../src/utils/helpers/date';

describe('date-types', () => {
  const now = () => new Date();
  const daysBack = (days: number) => subDays(new Date(), days);

  describe('dateRangeIsEmpty', () => {
    it.each([
      [undefined, true],
      [{}, true],
      [{ startDate: null }, true],
      [{ endDate: null }, true],
      [{ startDate: null, endDate: null }, true],
      [{ startDate: undefined }, true],
      [{ endDate: undefined }, true],
      [{ startDate: undefined, endDate: undefined }, true],
      [{ startDate: undefined, endDate: null }, true],
      [{ startDate: null, endDate: undefined }, true],
      [{ startDate: new Date() }, false],
      [{ endDate: new Date() }, false],
      [{ startDate: new Date(), endDate: new Date() }, false],
    ])('returns proper result', (dateRange, expectedResult) => {
      expect(dateRangeIsEmpty(dateRange)).toEqual(expectedResult);
    });
  });

  describe('rangeIsInterval', () => {
    it.each([
      [undefined, false],
      [{}, false],
      ['today' as DateInterval, true],
      ['yesterday' as DateInterval, true],
    ])('returns proper result', (range, expectedResult) => {
      expect(rangeIsInterval(range)).toEqual(expectedResult);
    });
  });

  describe('rangeOrIntervalToString', () => {
    it.each([
      [undefined, undefined],
      ['today' as DateInterval, 'Today'],
      ['yesterday' as DateInterval, 'Yesterday'],
      ['last7Days' as DateInterval, 'Last 7 days'],
      ['last30Days' as DateInterval, 'Last 30 days'],
      ['last90Days' as DateInterval, 'Last 90 days'],
      ['last180Days' as DateInterval, 'Last 180 days'],
      ['last365Days' as DateInterval, 'Last 365 days'],
      [{}, undefined],
      [{ startDate: null }, undefined],
      [{ endDate: null }, undefined],
      [{ startDate: null, endDate: null }, undefined],
      [{ startDate: undefined }, undefined],
      [{ endDate: undefined }, undefined],
      [{ startDate: undefined, endDate: undefined }, undefined],
      [{ startDate: undefined, endDate: null }, undefined],
      [{ startDate: null, endDate: undefined }, undefined],
      [{ startDate: parseDate('2020-01-01', 'yyyy-MM-dd') }, 'Since 2020-01-01'],
      [{ endDate: parseDate('2020-01-01', 'yyyy-MM-dd') }, 'Until 2020-01-01'],
      [
        { startDate: parseDate('2020-01-01', 'yyyy-MM-dd'), endDate: parseDate('2021-02-02', 'yyyy-MM-dd') },
        '2020-01-01 - 2021-02-02',
      ],
    ])('returns proper result', (range, expectedValue) => {
      expect(rangeOrIntervalToString(range)).toEqual(expectedValue);
    });
  });

  describe('intervalToDateRange', () => {
    const formatted = (date?: Date | null): string | undefined => (!date ? undefined : format(date, 'yyyy-MM-dd'));

    it.each([
      [undefined, undefined, undefined],
      ['today' as DateInterval, now(), now()],
      ['yesterday' as DateInterval, daysBack(1), daysBack(1)],
      ['last7Days' as DateInterval, daysBack(7), now()],
      ['last30Days' as DateInterval, daysBack(30), now()],
      ['last90Days' as DateInterval, daysBack(90), now()],
      ['last180Days' as DateInterval, daysBack(180), now()],
      ['last365Days' as DateInterval, daysBack(365), now()],
    ])('returns proper result', (interval, expectedStartDate, expectedEndDate) => {
      const { startDate, endDate } = intervalToDateRange(interval);

      expect(formatted(expectedStartDate)).toEqual(formatted(startDate));
      expect(formatted(expectedEndDate)).toEqual(formatted(endDate));
    });
  });

  describe('dateToMatchingInterval', () => {
    it.each([
      [startOfDay(now()), 'today'],
      [now(), 'today'],
      [formatISO(now()), 'today'],
      [daysBack(1), 'yesterday'],
      [endOfDay(daysBack(1)), 'yesterday'],
      [daysBack(2), 'last7Days'],
      [daysBack(7), 'last7Days'],
      [startOfDay(daysBack(7)), 'last7Days'],
      [daysBack(18), 'last30Days'],
      [daysBack(29), 'last30Days'],
      [daysBack(58), 'last90Days'],
      [startOfDay(daysBack(90)), 'last90Days'],
      [daysBack(120), 'last180Days'],
      [daysBack(250), 'last365Days'],
      [daysBack(366), 'all'],
      [formatISO(daysBack(500)), 'all'],
    ])('returns the first interval which contains provided date', (date, expectedInterval) => {
      expect(dateToMatchingInterval(date)).toEqual(expectedInterval);
    });
  });
});
