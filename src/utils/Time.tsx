import { parseISO, format as formatDate, getUnixTime, formatDistance } from 'date-fns';
import { isDateObject } from './helpers/date';

export interface TimeProps {
  date: Date | string;
  format?: string;
  relative?: boolean;
}

export const Time = ({ date, format = 'yyyy-MM-dd HH:mm', relative = false }: TimeProps) => {
  const dateObject = isDateObject(date) ? date : parseISO(date);

  return (
    <time dateTime={`${getUnixTime(dateObject)}000`}>
      {relative ? `${formatDistance(new Date(), dateObject)} ago` : formatDate(dateObject, format)}
    </time>
  );
};
