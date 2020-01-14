import React from 'react';
import PropTypes from 'prop-types';
import DateInput from './DateInput';
import './DateRangeRow.scss';

const dateType = PropTypes.oneOfType([ PropTypes.string, PropTypes.object ]);
const propTypes = {
  startDate: dateType,
  endDate: dateType,
  onStartDateChane: PropTypes.func.isRequired,
  onEndDateChange: PropTypes.func.isRequired,
};

const DateRangeRow = ({ startDate, endDate, onStartDateChane, onEndDateChange }) => (
  <div className="row">
    <div className="col-xl-3 col-lg-4 col-md-6 offset-xl-6 offset-lg-4">
      <DateInput
        selected={startDate}
        placeholderText="Since"
        isClearable
        maxDate={endDate}
        onChange={onStartDateChane}
      />
    </div>
    <div className="col-xl-3 col-lg-4 col-md-6">
      <DateInput
        className="date-range-row__date-input"
        selected={endDate}
        placeholderText="Until"
        isClearable
        minDate={startDate}
        onChange={onEndDateChange}
      />
    </div>
  </div>
);

DateRangeRow.propTypes = propTypes;

export default DateRangeRow;
