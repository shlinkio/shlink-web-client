import { format, subDays } from 'date-fns';
import {
  DateInterval,
  dateRangeIsEmpty,
  intervalToDateRange,
  rangeIsInterval,
  rangeOrIntervalToString,
} from '../../../../src/utils/dates/types';
import { parseDate } from '../../../../src/utils/helpers/date';

describe('date-types', () => {
  describe('dateRangeIsEmpty', () => {
    it.each([
      [ undefined, true ],
      [{}, true ],
      [{ startDate: null }, true ],
      [{ endDate: null }, true ],
      [{ startDate: null, endDate: null }, true ],
      [{ startDate: undefined }, true ],
      [{ endDate: undefined }, true ],
      [{ startDate: undefined, endDate: undefined }, true ],
      [{ startDate: undefined, endDate: null }, true ],
      [{ startDate: null, endDate: undefined }, true ],
      [{ startDate: new Date() }, false ],
      [{ endDate: new Date() }, false ],
      [{ startDate: new Date(), endDate: new Date() }, false ],
    ])('returns proper result', (dateRange, expectedResult) => {
      expect(dateRangeIsEmpty(dateRange)).toEqual(expectedResult);
    });
  });

  describe('rangeIsInterval', () => {
    it.each([
      [ undefined, false ],
      [{}, false ],
      [ 'today' as DateInterval, true ],
      [ 'yesterday' as DateInterval, true ],
    ])('returns proper result', (range, expectedResult) => {
      expect(rangeIsInterval(range)).toEqual(expectedResult);
    });
  });

  describe('rangeOrIntervalToString', () => {
    it.each([
      [ undefined, undefined ],
      [ 'today' as DateInterval, 'Today' ],
      [ 'yesterday' as DateInterval, 'Yesterday' ],
      [ 'last7Days' as DateInterval, 'Last 7 days' ],
      [ 'last30Days' as DateInterval, 'Last 30 days' ],
      [ 'last90Days' as DateInterval, 'Last 90 days' ],
      [ 'last180days' as DateInterval, 'Last 180 days' ],
      [ 'last365Days' as DateInterval, 'Last 365 days' ],
      [{}, undefined ],
      [{ startDate: null }, undefined ],
      [{ endDate: null }, undefined ],
      [{ startDate: null, endDate: null }, undefined ],
      [{ startDate: undefined }, undefined ],
      [{ endDate: undefined }, undefined ],
      [{ startDate: undefined, endDate: undefined }, undefined ],
      [{ startDate: undefined, endDate: null }, undefined ],
      [{ startDate: null, endDate: undefined }, undefined ],
      [{ startDate: parseDate('2020-01-01', 'yyyy-MM-dd') }, 'Since 2020-01-01' ],
      [{ endDate: parseDate('2020-01-01', 'yyyy-MM-dd') }, 'Until 2020-01-01' ],
      [
        { startDate: parseDate('2020-01-01', 'yyyy-MM-dd'), endDate: parseDate('2021-02-02', 'yyyy-MM-dd') },
        '2020-01-01 - 2021-02-02',
      ],
    ])('returns proper result', (range, expectedValue) => {
      expect(rangeOrIntervalToString(range)).toEqual(expectedValue);
    });
  });

  describe('intervalToDateRange', () => {
    const now = () => new Date();
    const daysBack = (days: number) => subDays(new Date(), days);
    const formatted = (date?: Date | null): string | undefined => !date ? undefined : format(date, 'yyyy-MM-dd');

    it.each([
      [ undefined, undefined, undefined ],
      [ 'today' as DateInterval, now(), now() ],
      [ 'yesterday' as DateInterval, daysBack(1), daysBack(1) ],
      [ 'last7Days' as DateInterval, daysBack(7), now() ],
      [ 'last30Days' as DateInterval, daysBack(30), now() ],
      [ 'last90Days' as DateInterval, daysBack(90), now() ],
      [ 'last180days' as DateInterval, daysBack(180), now() ],
      [ 'last365Days' as DateInterval, daysBack(365), now() ],
    ])('returns proper result', (interval, expectedStartDate, expectedEndDate) => {
      const { startDate, endDate } = intervalToDateRange(interval);

      expect(formatted(expectedStartDate)).toEqual(formatted(startDate));
      expect(formatted(expectedEndDate)).toEqual(formatted(endDate));
    });
  });
});
