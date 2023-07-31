import { useState } from 'react';
import { DropdownItem } from 'reactstrap';
import { DropdownBtn } from '../../../shlink-frontend-kit/src';
import { useEffectExceptFirstTime } from '../helpers/hooks';
import { DateIntervalDropdownItems } from './DateIntervalDropdownItems';
import { DateRangeRow } from './DateRangeRow';
import type {
  DateInterval,
  DateRange } from './helpers/dateIntervals';
import {
  ALL,
  dateRangeIsEmpty,
  intervalToDateRange,
  rangeIsInterval,
  rangeOrIntervalToString,
} from './helpers/dateIntervals';

export interface DateRangeSelectorProps {
  initialDateRange?: DateInterval | DateRange;
  disabled?: boolean;
  onDatesChange: (dateRange: DateRange) => void;
  defaultText: string;
  updatable?: boolean;
}

export const DateRangeSelector = (
  { onDatesChange, initialDateRange, defaultText, disabled, updatable = false }: DateRangeSelectorProps,
) => {
  const initialIntervalIsRange = rangeIsInterval(initialDateRange);
  const [activeInterval, setActiveInterval] = useState<DateInterval | undefined>(
    initialIntervalIsRange ? initialDateRange : undefined,
  );
  const [activeDateRange, setActiveDateRange] = useState(initialIntervalIsRange ? undefined : initialDateRange);

  const updateDateRange = (dateRange: DateRange) => {
    setActiveInterval(dateRangeIsEmpty(dateRange) ? ALL : undefined);
    setActiveDateRange(dateRange);
    onDatesChange(dateRange);
  };
  const updateInterval = (dateInterval: DateInterval) => {
    setActiveInterval(dateInterval);
    setActiveDateRange(undefined);
    onDatesChange(intervalToDateRange(dateInterval));
  };

  updatable && useEffectExceptFirstTime(() => {
    const isDateInterval = rangeIsInterval(initialDateRange);

    isDateInterval && updateInterval(initialDateRange);
    initialDateRange && !isDateInterval && updateDateRange(initialDateRange);
  }, [initialDateRange]);

  return (
    <DropdownBtn disabled={disabled} text={rangeOrIntervalToString(activeInterval ?? activeDateRange) ?? defaultText}>
      <DateIntervalDropdownItems allText={defaultText} active={activeInterval} onChange={updateInterval} />
      <DropdownItem divider />
      <DropdownItem header>Custom:</DropdownItem>
      <DropdownItem text>
        <DateRangeRow
          {...activeDateRange}
          onStartDateChange={(startDate) => updateDateRange({ ...activeDateRange, startDate })}
          onEndDateChange={(endDate) => updateDateRange({ ...activeDateRange, endDate })}
        />
      </DropdownItem>
    </DropdownBtn>
  );
};
