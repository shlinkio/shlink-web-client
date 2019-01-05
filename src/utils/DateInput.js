import React from 'react';
import { isNil } from 'ramda';
import DatePicker from 'react-datepicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt as calendarIcon } from '@fortawesome/free-regular-svg-icons';
import * as PropTypes from 'prop-types';
import './DateInput.scss';

const propTypes = {
  className: PropTypes.string,
  isClearable: PropTypes.bool,
  selected: PropTypes.oneOfType([ PropTypes.string, PropTypes.object ]),
  ref: PropTypes.object,
};

const DateInput = (props) => {
  const { className, isClearable, selected, ref = React.createRef() } = props;
  const showCalendarIcon = !isClearable || isNil(selected);

  return (
    <div className="date-input-container">
      <DatePicker
        {...props}
        className={`date-input-container__input form-control ${className || ''}`}
        dateFormat="YYYY-MM-DD"
        readOnly
        ref={ref}
      />
      {showCalendarIcon && (
        <FontAwesomeIcon
          icon={calendarIcon}
          className="date-input-container__icon"
          onClick={() => ref.current.input.focus()}
        />
      )}
    </div>
  );
};

DateInput.propTypes = propTypes;

export default DateInput;
