import { format, formatISO } from 'date-fns';
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
