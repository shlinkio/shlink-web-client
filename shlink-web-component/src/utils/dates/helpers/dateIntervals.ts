import { endOfDay, startOfDay, subDays } from 'date-fns';
import { cond, filter, isEmpty, T } from 'ramda';
import type { DateOrString } from './date';
import { formatInternational, isBeforeOrEqual, now, parseISO } from './date';

export interface DateRange {
  startDate?: Date | null;
  endDate?: Date | null;
}

export const ALL = 'all';
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

export const DATE_INTERVALS = INTERVALS.filter((value) => value !== ALL) as Exclude<DateInterval, typeof ALL>[];

const dateOrNull = (date?: string): Date | null => (date ? parseISO(date) : null);

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

const startOfDaysAgo = (daysAgo: number) => startOfDay(subDays(now(), daysAgo));
const endingToday = (startDate: Date): DateRange => ({ startDate, endDate: endOfDay(now()) });
const equals = (value: any) => (otherValue: any) => value === otherValue;

export const intervalToDateRange = cond<[DateInterval | undefined], DateRange>([
  [equals('today'), () => endingToday(startOfDay(now()))],
  [equals('yesterday'), () => ({ startDate: startOfDaysAgo(1), endDate: endOfDay(subDays(now(), 1)) })],
  [equals('last7Days'), () => endingToday(startOfDaysAgo(7))],
  [equals('last30Days'), () => endingToday(startOfDaysAgo(30))],
  [equals('last90Days'), () => endingToday(startOfDaysAgo(90))],
  [equals('last180Days'), () => endingToday(startOfDaysAgo(180))],
  [equals('last365Days'), () => endingToday(startOfDaysAgo(365))],
  [T, () => ({})],
]);

export const dateToMatchingInterval = (date: DateOrString): DateInterval => {
  const theDate = parseISO(date);

  return cond<never[], DateInterval>([
    [() => isBeforeOrEqual(startOfDay(now()), theDate), () => 'today'],
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
