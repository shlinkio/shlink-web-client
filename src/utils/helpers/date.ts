import * as moment from 'moment';
import { OptionalString } from '../utils';

type MomentOrString = moment.Moment | string;
type NullableDate = MomentOrString | null;

const isMomentObject = (date: MomentOrString): date is moment.Moment => typeof (date as moment.Moment).format === 'function';

const formatDateFromFormat = (date?: NullableDate, format?: string): OptionalString =>
  !date || !isMomentObject(date) ? date : date.format(format);

export const formatDate = (format = 'YYYY-MM-DD') => (date?: NullableDate) => formatDateFromFormat(date, format);

export const formatIsoDate = (date?: NullableDate) => formatDateFromFormat(date, undefined);

export const formatInternational = formatDate();
