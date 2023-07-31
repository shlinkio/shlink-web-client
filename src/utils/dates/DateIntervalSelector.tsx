import type { FC } from 'react';
import { DropdownItem } from 'reactstrap';
import type { Settings } from '../../../shlink-web-component';
import { rangeOrIntervalToString } from '../../../shlink-web-component/utils/dates/helpers/dateIntervals';
import { DropdownBtn } from '../DropdownBtn';

type DateInterval = Exclude<Settings['visits'], undefined>['defaultInterval'];

export interface DateIntervalSelectorProps {
  active?: DateInterval;
  allText: string;
  onChange: (interval: DateInterval) => void;
}

const INTERVAL_TO_STRING_MAP: Record<Exclude<DateInterval, 'all'>, string> = {
  today: 'Today',
  yesterday: 'Yesterday',
  last7Days: 'Last 7 days',
  last30Days: 'Last 30 days',
  last90Days: 'Last 90 days',
  last180Days: 'Last 180 days',
  last365Days: 'Last 365 days',
};

export const DateIntervalSelector: FC<DateIntervalSelectorProps> = ({ onChange, active, allText }) => (
  <DropdownBtn text={rangeOrIntervalToString(active) ?? allText}>
    <DropdownItem active={active === 'all'} onClick={() => onChange('all')}>
      {allText}
    </DropdownItem>
    <DropdownItem divider />
    {Object.entries(INTERVAL_TO_STRING_MAP).map(
      ([interval, name]) => (
        <DropdownItem key={interval} active={active === interval} onClick={() => onChange(interval as DateInterval)}>
          {name}
        </DropdownItem>
      ),
    )}
  </DropdownBtn>
);
