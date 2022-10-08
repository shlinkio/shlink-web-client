import { useRef } from 'react';
import { isNil } from 'ramda';
import DatePicker, { ReactDatePickerProps } from 'react-datepicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt as calendarIcon } from '@fortawesome/free-regular-svg-icons';
import classNames from 'classnames';
import './DateInput.scss';

export type DateInputProps = ReactDatePickerProps;

export const DateInput = (props: DateInputProps) => {
  const { className, isClearable, selected } = props;
  const showCalendarIcon = !isClearable || isNil(selected);
  const ref = useRef<{ input: HTMLInputElement }>();

  return (
    <div className="date-input-container">
      <DatePicker
        {...props}
        popperModifiers={[
          {
            name: 'arrow',
            options: { padding: 24 }, // This prevents the arrow to be placed on the very edge, which looks ugly
          },
        ]}
        dateFormat="yyyy-MM-dd"
        className={classNames('date-input-container__input form-control', className)}
        // @ts-expect-error The DatePicker type definition is wrong. It has a ref prop
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
