import { subDays, startOfDay, endOfDay } from 'date-fns';
import { filter, isEmpty } from 'ramda';
import { formatInternational } from '../../helpers/date';

export interface DateRange {
  startDate?: Date | null;
  endDate?: Date | null;
}

export type DateInterval = 'all' | 'today' | 'yesterday' | 'last7Days' | 'last30Days' | 'last90Days' | 'last180days' | 'last365Days';

export const dateRangeIsEmpty = (dateRange?: DateRange): boolean => dateRange === undefined
  || isEmpty(filter(Boolean, dateRange as any));

export const rangeIsInterval = (range?: DateRange | DateInterval): range is DateInterval =>
  typeof range === 'string';

const INTERVAL_TO_STRING_MAP: Record<DateInterval, string | undefined> = {
  today: 'Today',
  yesterday: 'Yesterday',
  last7Days: 'Last 7 days',
  last30Days: 'Last 30 days',
  last90Days: 'Last 90 days',
  last180days: 'Last 180 days',
  last365Days: 'Last 365 days',
  all: undefined,
};

export const DATE_INTERVALS = Object.keys(INTERVAL_TO_STRING_MAP).filter((value) => value !== 'all') as DateInterval[];

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
  if (!range || range === 'all') {
    return undefined;
  }

  if (!rangeIsInterval(range)) {
    return dateRangeToString(range);
  }

  return INTERVAL_TO_STRING_MAP[range];
};

const startOfDaysAgo = (daysAgo: number) => startOfDay(subDays(new Date(), daysAgo));
const endingToday = (startDate: Date): DateRange => ({ startDate, endDate: endOfDay(new Date()) });

export const intervalToDateRange = (dateInterval?: DateInterval): DateRange => {
  if (!dateInterval || dateInterval === 'all') {
    return {};
  }

  switch (dateInterval) {
    case 'today':
      return endingToday(startOfDay(new Date()));
    case 'yesterday':
      return { startDate: startOfDaysAgo(1), endDate: endOfDay(subDays(new Date(), 1)) };
    case 'last7Days':
      return endingToday(startOfDaysAgo(7));
    case 'last30Days':
      return endingToday(startOfDaysAgo(30));
    case 'last90Days':
      return endingToday(startOfDaysAgo(90));
    case 'last180days':
      return endingToday(startOfDaysAgo(180));
    case 'last365Days':
      return endingToday(startOfDaysAgo(365));
  }

  return {};
};
