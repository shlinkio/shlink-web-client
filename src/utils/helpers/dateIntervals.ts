import { subDays, startOfDay, endOfDay } from 'date-fns';
import { cond, filter, isEmpty, T } from 'ramda';
import { dateOrNull, DateOrString, formatInternational, isBeforeOrEqual, parseISO } from './date';

export interface DateRange {
  startDate?: Date | null;
  endDate?: Date | null;
}

const ALL = 'all';
const INTERVAL_TO_STRING_MAP = {
  today: 'Today',
  yesterday: 'Yesterday',
  last7Days: 'Last 7 days',
  last30Days: 'Last 30 days',
  last90Days: 'Last 90 days',
  last180Days: 'Last 180 days',
  last365Days: 'Last 365 days',
  [ALL]: undefined,
};

export type DateInterval = keyof typeof INTERVAL_TO_STRING_MAP;

const INTERVALS = Object.keys(INTERVAL_TO_STRING_MAP) as DateInterval[];

export const dateRangeIsEmpty = (dateRange?: DateRange): boolean => dateRange === undefined
  || isEmpty(filter(Boolean, dateRange as any));

export const rangeIsInterval = (range?: DateRange | DateInterval): range is DateInterval =>
  typeof range === 'string' && INTERVALS.includes(range);

export const DATE_INTERVALS = INTERVALS.filter((value) => value !== ALL) as DateInterval[];

export const datesToDateRange = (startDate?: string, endDate?: string): DateRange => ({
  startDate: dateOrNull(startDate),
  endDate: dateOrNull(endDate),
});

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
  if (!range || range === ALL) {
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
  if (!dateInterval || dateInterval === ALL) {
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
    case 'last180Days':
      return endingToday(startOfDaysAgo(180));
    case 'last365Days':
      return endingToday(startOfDaysAgo(365));
  }

  return {};
};

export const dateToMatchingInterval = (date: DateOrString): DateInterval => {
  const theDate: Date = parseISO(date);

  return cond<never, DateInterval>([
    [() => isBeforeOrEqual(startOfDay(new Date()), theDate), () => 'today'],
    [() => isBeforeOrEqual(startOfDaysAgo(1), theDate), () => 'yesterday'],
    [() => isBeforeOrEqual(startOfDaysAgo(7), theDate), () => 'last7Days'],
    [() => isBeforeOrEqual(startOfDaysAgo(30), theDate), () => 'last30Days'],
    [() => isBeforeOrEqual(startOfDaysAgo(90), theDate), () => 'last90Days'],
    [() => isBeforeOrEqual(startOfDaysAgo(180), theDate), () => 'last180Days'],
    [() => isBeforeOrEqual(startOfDaysAgo(365), theDate), () => 'last365Days'],
    [T, () => ALL],
  ])();
};

export const toDateRange = (rangeOrInterval: DateRange | DateInterval): DateRange => {
  if (rangeIsInterval(rangeOrInterval)) {
    return intervalToDateRange(rangeOrInterval);
  }

  return rangeOrInterval;
};
