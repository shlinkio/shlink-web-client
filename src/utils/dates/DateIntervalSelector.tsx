import { FC } from 'react';
import { DropdownBtn } from '../DropdownBtn';
import { rangeOrIntervalToString } from '../helpers/dateIntervals';
import { DateIntervalDropdownItems, DateIntervalDropdownProps } from './DateIntervalDropdownItems';

export const DateIntervalSelector: FC<DateIntervalDropdownProps> = ({ onChange, active, allText }) => (
  <DropdownBtn text={rangeOrIntervalToString(active) ?? allText}>
    <DateIntervalDropdownItems allText={allText} active={active} onChange={onChange} />
  </DropdownBtn>
);
