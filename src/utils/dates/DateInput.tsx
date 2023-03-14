import { faCalendarAlt as calendarIcon } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { isNil } from 'ramda';
import { useRef } from 'react';
import type { ReactDatePickerProps } from 'react-datepicker';
import DatePicker from 'react-datepicker';
import { STANDARD_DATE_FORMAT } from '../helpers/date';
import './DateInput.scss';

export type DateInputProps = ReactDatePickerProps;

export const DateInput = (props: DateInputProps) => {
  const { className, isClearable, selected, dateFormat } = props;
  const showCalendarIcon = !isClearable || isNil(selected);
  const ref = useRef<{ input: HTMLInputElement }>();

  return (
    <div className="icon-input-container">
      <DatePicker
        {...props}
        popperModifiers={[
          {
            name: 'arrow',
            options: { padding: 24 }, // This prevents the arrow to be placed on the very edge, which looks ugly
          },
        ]}
        dateFormat={dateFormat ?? STANDARD_DATE_FORMAT}
        className={classNames('icon-input-container__input form-control', className)}
        // @ts-expect-error The DatePicker type definition is wrong. It has a ref prop
        ref={ref}
      />
      {showCalendarIcon && (
        <FontAwesomeIcon
          icon={calendarIcon}
          className="icon-input-container__icon"
          onClick={() => ref.current?.input.focus()}
        />
      )}
    </div>
  );
};
