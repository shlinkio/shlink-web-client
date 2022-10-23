import { parseISO, format as formatDate, getUnixTime, formatDistance } from 'date-fns';
import { isDateObject, STANDARD_DATE_AND_TIME_FORMAT } from './helpers/date';

export interface TimeProps {
  date: Date | string;
  format?: string;
  relative?: boolean;
}

export const Time = ({ date, format = STANDARD_DATE_AND_TIME_FORMAT, relative = false }: TimeProps) => {
  const dateObject = isDateObject(date) ? date : parseISO(date);

  return (
    <time dateTime={`${getUnixTime(dateObject)}000`}>
      {relative ? `${formatDistance(new Date(), dateObject)} ago` : formatDate(dateObject, format)}
    </time>
  );
};
