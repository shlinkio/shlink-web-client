import moment from 'moment';
import { filter, isEmpty } from 'ramda';
import { formatInternational } from '../../helpers/date';

export interface DateRange {
  startDate?: moment.Moment | null;
  endDate?: moment.Moment | null;
}

export type DateInterval = 'today' | 'yesterday' | 'last7Days' | 'last30Days' | 'last90Days' | 'last180days' | 'last365Days';

export const dateRangeIsEmpty = (dateRange?: DateRange): boolean => dateRange === undefined
  || isEmpty(filter(Boolean, dateRange as any));

export const rangeIsInterval = (range?: DateRange | DateInterval): range is DateInterval => typeof range === 'string';

const INTERVAL_TO_STRING_MAP: Record<DateInterval, string> = {
  today: 'Today',
  yesterday: 'Yesterday',
  last7Days: 'Last 7 days',
  last30Days: 'Last 30 days',
  last90Days: 'Last 90 days',
  last180days: 'Last 180 days',
  last365Days: 'Last 365 days',
};

const dateRangeToString = (range?: DateRange): string | undefined => {
  if (!range || dateRangeIsEmpty(range)) {
    return undefined;
  }

  if (range.startDate && !range.endDate) {
    return `Since ${formatInternational(range.startDate)}`;
  }

  if (!range.startDate && range.endDate) {
    return `Until ${formatInternational(range.endDate)}`;
  }

  return `${formatInternational(range.startDate)} - ${formatInternational(range.endDate)}`;
};

export const rangeOrIntervalToString = (range?: DateRange | DateInterval): string | undefined => {
  if (!range) {
    return undefined;
  }

  if (!rangeIsInterval(range)) {
    return dateRangeToString(range);
  }

  return INTERVAL_TO_STRING_MAP[range];
};

export const intervalToDateRange = (dateInterval?: DateInterval): DateRange => {
  if (!dateInterval) {
    return {};
  }

  switch (dateInterval) {
    case 'today':
      return { startDate: moment().startOf('day'), endDate: moment() };
    case 'yesterday':
      const yesterday = moment().subtract(1, 'day'); // eslint-disable-line no-case-declarations

      return { startDate: yesterday.startOf('day'), endDate: yesterday.endOf('day') };
    case 'last7Days':
      return { startDate: moment().subtract(7, 'days').startOf('day'), endDate: moment() };
    case 'last30Days':
      return { startDate: moment().subtract(30, 'days').startOf('day'), endDate: moment() };
    case 'last90Days':
      return { startDate: moment().subtract(90, 'days').startOf('day'), endDate: moment() };
    case 'last180days':
      return { startDate: moment().subtract(180, 'days').startOf('day'), endDate: moment() };
    case 'last365Days':
      return { startDate: moment().subtract(365, 'days').startOf('day'), endDate: moment() };
  }

  return {};
};
