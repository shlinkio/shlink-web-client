import { format as formatDate, formatDistance, getUnixTime, parseISO } from 'date-fns';
import { isDateObject, now, STANDARD_DATE_AND_TIME_FORMAT } from '../helpers/date';

export interface TimeProps {
  date: Date | string;
  format?: string;
  relative?: boolean;
}

export const Time = ({ date, format = STANDARD_DATE_AND_TIME_FORMAT, relative = false }: TimeProps) => {
  const dateObject = isDateObject(date) ? date : parseISO(date);

  return (
    <time dateTime={`${getUnixTime(dateObject)}000`}>
      {relative ? `${formatDistance(now(), dateObject)} ago` : formatDate(dateObject, format)}
    </time>
  );
};
