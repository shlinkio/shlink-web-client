import { Component, RefObject, createRef } from 'react';
import { isNil } from 'ramda';
import DatePicker, { ReactDatePickerProps } from 'react-datepicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt as calendarIcon } from '@fortawesome/free-regular-svg-icons';
import classNames from 'classnames';
import './DateInput.scss';

export interface DateInputProps extends ReactDatePickerProps {
  ref?: RefObject<Component<ReactDatePickerProps> & { input: HTMLInputElement }>;
}

const DateInput = (props: DateInputProps) => {
  const { className, isClearable, selected, ref = createRef() } = props;
  const showCalendarIcon = !isClearable || isNil(selected);

  return (
    <div className="date-input-container">
      <DatePicker
        {...props}
        className={classNames('date-input-container__input form-control', className)}
        dateFormat="YYYY-MM-DD"
        readOnly
        ref={ref}
      />
      {showCalendarIcon && (
        <FontAwesomeIcon
          icon={calendarIcon}
          className="date-input-container__icon"
          onClick={() => ref.current?.input.focus()}
        />
      )}
    </div>
  );
};

export default DateInput;
