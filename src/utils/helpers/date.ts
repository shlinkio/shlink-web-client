import { format, formatISO, isAfter, isBefore, isWithinInterval, parse, parseISO as stdParseISO } from 'date-fns';
import { OptionalString } from '../utils';

type DateOrString = Date | string;
type NullableDate = DateOrString | null;

export const isDateObject = (date: DateOrString): date is Date => typeof date !== 'string';

const formatDateFromFormat = (date?: NullableDate, theFormat?: string): OptionalString => {
  if (!date || !isDateObject(date)) {
    return date;
  }

  return theFormat ? format(date, theFormat) : formatISO(date);
};

export const formatDate = (format = 'yyyy-MM-dd') => (date?: NullableDate) => formatDateFromFormat(date, format);

export const formatIsoDate = (date?: NullableDate) => formatDateFromFormat(date, undefined);

export const formatInternational = formatDate();

export const parseDate = (date: string, format: string) => parse(date, format, new Date());

const parseISO = (date: DateOrString): Date => isDateObject(date) ? date : stdParseISO(date);

export const isBetween = (date: DateOrString, start?: DateOrString, end?: DateOrString): boolean => {
  if (!start && end) {
    return isBefore(parseISO(date), parseISO(end));
  }

  if (start && !end) {
    return isAfter(parseISO(date), parseISO(start));
  }

  if (start && end) {
    return isWithinInterval(parseISO(date), { start: parseISO(start), end: parseISO(end) });
  }

  return true;
};
