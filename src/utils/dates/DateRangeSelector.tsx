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

interface DateRangeSelectorProps {
  initialDateRange?: DateInterval | DateRange;
  disabled?: boolean;
  onDatesChange: (dateRange: DateRange) => void;
}

export const DateRangeSelector = ({ onDatesChange, initialDateRange, disabled = false }: DateRangeSelectorProps) => {
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
        {rangeOrIntervalToString(activeInterval ?? activeDateRange) ?? 'All visits'}
      </DropdownToggle>
      <DropdownMenu className="w-100">
        <DropdownItem
          active={activeInterval === undefined && dateRangeIsEmpty(activeDateRange)}
          onClick={updateInterval(undefined)}
        >
          All visits
        </DropdownItem>
        <DropdownItem divider />
        <DropdownItem active={activeInterval === 'today'} onClick={updateInterval('today')}>Today</DropdownItem>
        <DropdownItem active={activeInterval === 'yesterday'} onClick={updateInterval('yesterday')}>
          Yesterday
        </DropdownItem>
        <DropdownItem active={activeInterval === 'last7Days'} onClick={updateInterval('last7Days')}>
          Last 7 days
        </DropdownItem>
        <DropdownItem active={activeInterval === 'last30Days'} onClick={updateInterval('last30Days')}>
          Last 30 days
        </DropdownItem>
        <DropdownItem active={activeInterval === 'last90Days'} onClick={updateInterval('last90Days')}>
          Last 90 days
        </DropdownItem>
        <DropdownItem active={activeInterval === 'last180days'} onClick={updateInterval('last180days')}>
          Last 180 days
        </DropdownItem>
        <DropdownItem active={activeInterval === 'last365Days'} onClick={updateInterval('last365Days')}>
          Last 365 days
        </DropdownItem>
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
