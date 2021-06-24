import { subDays, startOfDay, endOfDay } from 'date-fns';
import { filter, isEmpty } from 'ramda';
import { formatInternational } from '../../helpers/date';

export interface DateRange {
  startDate?: Date | null;
  endDate?: Date | null;
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

export const DATE_INTERVALS: DateInterval[] = Object.keys(INTERVAL_TO_STRING_MAP) as DateInterval[];

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

const startOfDaysAgo = (daysAgo: number) => startOfDay(subDays(new Date(), daysAgo));

export const intervalToDateRange = (dateInterval?: DateInterval): DateRange => {
  if (!dateInterval) {
    return {};
  }

  switch (dateInterval) {
    case 'today':
      return { startDate: startOfDay(new Date()), endDate: new Date() };
    case 'yesterday':
      return { startDate: startOfDaysAgo(1), endDate: endOfDay(subDays(new Date(), 1)) };
    case 'last7Days':
      return { startDate: startOfDaysAgo(7), endDate: new Date() };
    case 'last30Days':
      return { startDate: startOfDaysAgo(30), endDate: new Date() };
    case 'last90Days':
      return { startDate: startOfDaysAgo(90), endDate: new Date() };
    case 'last180days':
      return { startDate: startOfDaysAgo(180), endDate: new Date() };
    case 'last365Days':
      return { startDate: startOfDaysAgo(365), endDate: new Date() };
  }

  return {};
};
