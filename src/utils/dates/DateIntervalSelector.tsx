import { DropdownBtn } from '@shlinkio/shlink-frontend-kit';
import type { VisitsSettings } from '@shlinkio/shlink-web-component';
import type { FC } from 'react';
import { DropdownItem } from 'reactstrap';

export type DateInterval = VisitsSettings['defaultInterval'];

export interface DateIntervalSelectorProps {
  active?: DateInterval;
  allText: string;
  onChange: (interval: DateInterval) => void;
}

export const INTERVAL_TO_STRING_MAP: Record<Exclude<DateInterval, 'all'>, string> = {
  today: 'Today',
  yesterday: 'Yesterday',
  last7Days: 'Last 7 days',
  last30Days: 'Last 30 days',
  last90Days: 'Last 90 days',
  last180Days: 'Last 180 days',
  last365Days: 'Last 365 days',
};

const intervalToString = (interval: DateInterval | undefined, fallback: string): string => {
  if (!interval || interval === 'all') {
    return fallback;
  }

  return INTERVAL_TO_STRING_MAP[interval];
};

export const DateIntervalSelector: FC<DateIntervalSelectorProps> = ({ onChange, active, allText }) => (
  <DropdownBtn text={intervalToString(active, allText)}>
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
