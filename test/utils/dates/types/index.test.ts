import moment from 'moment';
import {
  DateInterval,
  dateRangeIsEmpty,
  intervalToDateRange,
  rangeIsInterval,
  rangeOrIntervalToString,
} from '../../../../src/utils/dates/types';

describe('date-types', () => {
  describe('dateRangeIsEmpty', () => {
    test.each([
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
      [{ startDate: moment() }, false ],
      [{ endDate: moment() }, false ],
      [{ startDate: moment(), endDate: moment() }, false ],
    ])('proper result is returned', (dateRange, expectedResult) => {
      expect(dateRangeIsEmpty(dateRange)).toEqual(expectedResult);
    });
  });

  describe('rangeIsInterval', () => {
    test.each([
      [ undefined, false ],
      [{}, false ],
      [ 'today' as DateInterval, true ],
      [ 'yesterday' as DateInterval, true ],
    ])('proper result is returned', (range, expectedResult) => {
      expect(rangeIsInterval(range)).toEqual(expectedResult);
    });
  });

  describe('rangeOrIntervalToString', () => {
    test.each([
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
      [{ startDate: moment('2020-01-01') }, 'Since 2020-01-01' ],
      [{ endDate: moment('2020-01-01') }, 'Until 2020-01-01' ],
      [{ startDate: moment('2020-01-01'), endDate: moment('2021-02-02') }, '2020-01-01 - 2021-02-02' ],
    ])('proper result is returned', (range, expectedValue) => {
      expect(rangeOrIntervalToString(range)).toEqual(expectedValue);
    });
  });

  describe('intervalToDateRange', () => {
    const now = () => moment();

    test.each([
      [ undefined, undefined, undefined ],
      [ 'today' as DateInterval, now(), now() ],
      [ 'yesterday' as DateInterval, now().subtract(1, 'day'), now().subtract(1, 'day') ],
      [ 'last7Days' as DateInterval, now().subtract(7, 'day'), now() ],
      [ 'last30Days' as DateInterval, now().subtract(30, 'day'), now() ],
      [ 'last90Days' as DateInterval, now().subtract(90, 'day'), now() ],
      [ 'last180days' as DateInterval, now().subtract(180, 'day'), now() ],
      [ 'last365Days' as DateInterval, now().subtract(365, 'day'), now() ],
    ])('proper result is returned', (interval, expectedStartDate, expectedEndDate) => {
      const { startDate, endDate } = intervalToDateRange(interval);

      expect(expectedStartDate?.format('YYYY-MM-DD')).toEqual(startDate?.format('YYYY-MM-DD'));
      expect(expectedEndDate?.format('YYYY-MM-DD')).toEqual(endDate?.format('YYYY-MM-DD'));
    });
  });
});
