import React from 'react';
import moment from 'moment';
import DateInput from './DateInput';
import './DateRangeRow.scss';

interface DateRangeRowProps {
  startDate?: moment.Moment | null;
  endDate?: moment.Moment | null;
  onStartDateChange: (date: moment.Moment | null) => void;
  onEndDateChange: (date: moment.Moment | null) => void;
  disabled?: boolean;
}

const DateRangeRow = (
  { startDate = null, endDate = null, disabled = false, onStartDateChange, onEndDateChange }: DateRangeRowProps,
) => (
  <div className="row">
    <div className="col-md-6">
      <DateInput
        selected={startDate}
        placeholderText="Since"
        isClearable
        maxDate={endDate ?? undefined}
        disabled={disabled}
        onChange={onStartDateChange}
      />
    </div>
    <div className="col-md-6">
      <DateInput
        className="date-range-row__date-input"
        selected={endDate}
        placeholderText="Until"
        isClearable
        minDate={startDate ?? undefined}
        disabled={disabled}
        onChange={onEndDateChange}
      />
    </div>
  </div>
);

export default DateRangeRow;
