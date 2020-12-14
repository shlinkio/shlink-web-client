import { useState } from 'react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import { useToggle } from '../helpers/hooks';
import {
  DateInterval,
  DateRange,
  dateRangeIsEmpty,
  rangeOrIntervalToString,
  intervalToDateRange,
  rangeIsInterval,
} from './types';
import DateRangeRow from './DateRangeRow';
import './DateRangeSelector.scss';

export interface DateRangeSelectorProps {
  initialDateRange?: DateInterval | DateRange;
  disabled?: boolean;
  onDatesChange: (dateRange: DateRange) => void;
  defaultText: string;
}

export const DateRangeSelector = (
  { onDatesChange, initialDateRange, defaultText, disabled = false }: DateRangeSelectorProps,
) => {
  const [ isOpen, toggle ] = useToggle();
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
    <Dropdown isOpen={isOpen} toggle={toggle} disabled={disabled}>
      <DropdownToggle caret className="date-range-selector__btn btn-block" color="primary">
        {rangeOrIntervalToString(activeInterval ?? activeDateRange) ?? defaultText}
      </DropdownToggle>
      <DropdownMenu className="w-100">
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
      </DropdownMenu>
    </Dropdown>
  );
};
