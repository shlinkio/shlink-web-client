import { FC } from 'react';
import { DropdownBtn } from '../DropdownBtn';
import { rangeOrIntervalToString } from './types';
import { DateIntervalDropdownItems, DateIntervalDropdownProps } from './DateIntervalDropdownItems';

export const DateIntervalSelector: FC<DateIntervalDropdownProps> = ({ onChange, active }) => (
  <DropdownBtn text={rangeOrIntervalToString(active) ?? ''}>
    <DateIntervalDropdownItems active={active} onChange={onChange} />
  </DropdownBtn>
);
