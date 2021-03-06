import { DropdownItem } from 'reactstrap';
import { FC } from 'react';
import { DATE_INTERVALS, DateInterval, rangeOrIntervalToString } from './types';

export interface DateIntervalDropdownProps {
  active?: DateInterval;
  onChange: (interval: DateInterval) => void;
}

export const DateIntervalDropdownItems: FC<DateIntervalDropdownProps> = ({ active, onChange }) => (
  <>
    {DATE_INTERVALS.map(
      (interval) => (
        <DropdownItem key={interval} active={active === interval} onClick={() => onChange(interval)}>
          {rangeOrIntervalToString(interval)}
        </DropdownItem>
      ),
    )}
  </>
);
