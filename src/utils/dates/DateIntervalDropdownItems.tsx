import { DropdownItem } from 'reactstrap';
import { FC } from 'react';
import { DATE_INTERVALS, DateInterval, rangeOrIntervalToString } from './types';

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
