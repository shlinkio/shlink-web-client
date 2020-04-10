import React from 'react';
import PropTypes from 'prop-types';
import DateInput from './DateInput';
import './DateRangeRow.scss';

const dateType = PropTypes.oneOfType([ PropTypes.string, PropTypes.object ]);
const propTypes = {
  startDate: dateType,
  endDate: dateType,
  onStartDateChange: PropTypes.func.isRequired,
  onEndDateChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

const DateRangeRow = ({ startDate, endDate, onStartDateChange, onEndDateChange, disabled = false }) => (
  <div className="row">
    <div className="col-md-6">
      <DateInput
        selected={startDate}
        placeholderText="Since"
        isClearable
        maxDate={endDate}
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
        minDate={startDate}
        disabled={disabled}
        onChange={onEndDateChange}
      />
    </div>
  </div>
);

DateRangeRow.propTypes = propTypes;

export default DateRangeRow;
