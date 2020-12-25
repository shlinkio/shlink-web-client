import { useState } from 'react';
import { DropdownItem } from 'reactstrap';
import { Dropdown } from '../Dropdown';
import {
  DateInterval,
  DateRange,
  dateRangeIsEmpty,
  rangeOrIntervalToString,
  intervalToDateRange,
  rangeIsInterval,
} from './types';
import DateRangeRow from './DateRangeRow';

export interface DateRangeSelectorProps {
  initialDateRange?: DateInterval | DateRange;
  disabled?: boolean;
  onDatesChange: (dateRange: DateRange) => void;
  defaultText: string;
}

export const DateRangeSelector = (
  { onDatesChange, initialDateRange, defaultText, disabled }: DateRangeSelectorProps,
) => {
  const [ activeInterval, setActiveInterval ] = useState(
    rangeIsInterval(initialDateRange) ? initialDateRange : undefined,
  );
  const [ activeDateRange, setActiveDateRange ] = useState(
    !rangeIsInterval(initialDateRange) ? initialDateRange : undefined,
  );
  const updateDateRange = (dateRange: DateRange) => {
    setActiveInterval(undefined);
    setActiveDateRange(dateRange);
    onDatesChange(dateRange);
  };
  const updateInterval = (dateInterval?: DateInterval) => () => {
    setActiveInterval(dateInterval);
    setActiveDateRange(undefined);
    onDatesChange(intervalToDateRange(dateInterval));
  };

  return (
    <Dropdown disabled={disabled} text={rangeOrIntervalToString(activeInterval ?? activeDateRange) ?? defaultText}>
      <DropdownItem
        active={activeInterval === undefined && dateRangeIsEmpty(activeDateRange)}
        onClick={updateInterval(undefined)}
      >
        {defaultText}
      </DropdownItem>
      <DropdownItem divider />
      {([ 'today', 'yesterday', 'last7Days', 'last30Days', 'last90Days', 'last180days', 'last365Days' ] as DateInterval[]).map(
        (interval) => (
          <DropdownItem key={interval} active={activeInterval === interval} onClick={updateInterval(interval)}>
            {rangeOrIntervalToString(interval)}
          </DropdownItem>
        ),
      )}
      <DropdownItem divider />
      <DropdownItem header>Custom:</DropdownItem>
      <DropdownItem text>
        <DateRangeRow
          {...activeDateRange}
          onStartDateChange={(startDate) => updateDateRange({ ...activeDateRange, startDate })}
          onEndDateChange={(endDate) => updateDateRange({ ...activeDateRange, endDate })}
        />
      </DropdownItem>
    </Dropdown>
  );
};
