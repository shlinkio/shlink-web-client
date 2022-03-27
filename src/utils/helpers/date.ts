import { format, formatISO, isBefore, isEqual, isWithinInterval, parse, parseISO as stdParseISO } from 'date-fns';
import { OptionalString } from '../utils';

export type DateOrString = Date | string;

type NullableDate = DateOrString | null;

export const isDateObject = (date: DateOrString): date is Date => typeof date !== 'string';

const formatDateFromFormat = (date?: NullableDate, theFormat?: string): OptionalString => {
  if (!date || !isDateObject(date)) {
    return date;
  }

  return theFormat ? format(date, theFormat) : formatISO(date);
};

export const formatDate = (theFormat = 'yyyy-MM-dd') => (date?: NullableDate) => formatDateFromFormat(date, theFormat);

export const formatIsoDate = (date?: NullableDate) => formatDateFromFormat(date, undefined);

export const formatInternational = formatDate();

export const parseDate = (date: string, theFormat: string) => parse(date, theFormat, new Date());

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
