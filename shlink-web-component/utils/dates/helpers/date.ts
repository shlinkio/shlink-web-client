import { format, formatISO, isBefore, isEqual, isWithinInterval, parse, parseISO as stdParseISO } from 'date-fns';

export const STANDARD_DATE_FORMAT = 'yyyy-MM-dd';

export const STANDARD_DATE_AND_TIME_FORMAT = 'yyyy-MM-dd HH:mm';

export type DateOrString = Date | string;

type NullableDate = DateOrString | null;

export const now = () => new Date();

export const isDateObject = (date: DateOrString): date is Date => typeof date !== 'string';

const formatDateFromFormat = (date?: NullableDate, theFormat?: string): string | null | undefined => {
  if (!date || !isDateObject(date)) {
    return date;
  }

  return theFormat ? format(date, theFormat) : formatISO(date);
};

export const formatIsoDate = (date?: NullableDate) => formatDateFromFormat(date, undefined);

export const formatInternational = (date?: NullableDate) => formatDateFromFormat(date, STANDARD_DATE_FORMAT);

export const formatHumanFriendly = (date?: NullableDate) => formatDateFromFormat(date, STANDARD_DATE_AND_TIME_FORMAT);

export const parseDate = (date: string, theFormat: string) => parse(date, theFormat, now());

export const parseISO = (date: DateOrString): Date => (isDateObject(date) ? date : stdParseISO(date));

export const isBetween = (date: DateOrString, start?: DateOrString, end?: DateOrString): boolean => {
  try {
    return isWithinInterval(parseISO(date), { start: parseISO(start ?? date), end: parseISO(end ?? date) });
  } catch (e) {
    return false;
  }
};

export const isBeforeOrEqual = (date: Date | number, dateToCompare: Date | number) =>
  isEqual(date, dateToCompare) || isBefore(date, dateToCompare);
