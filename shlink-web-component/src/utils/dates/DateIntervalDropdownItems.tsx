import type { FC } from 'react';
import { DropdownItem } from 'reactstrap';
import type { DateInterval } from './helpers/dateIntervals';
import { DATE_INTERVALS, rangeOrIntervalToString } from './helpers/dateIntervals';

export interface DateIntervalDropdownProps {
  active?: DateInterval;
  allText: string;
  onChange: (interval: DateInterval) => void;
}

export const DateIntervalDropdownItems: FC<DateIntervalDropdownProps> = ({ active, allText, onChange }) => (
  <>
    <DropdownItem active={active === 'all'} onClick={() => onChange('all')}>
      {allText}
    </DropdownItem>
    <DropdownItem divider />
    {DATE_INTERVALS.map(
      (interval) => (
        <DropdownItem key={interval} active={active === interval} onClick={() => onChange(interval)}>
          {rangeOrIntervalToString(interval)}
        </DropdownItem>
      ),
    )}
  </>
);
