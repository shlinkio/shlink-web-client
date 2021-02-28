import { useRef } from 'react';
import { isNil, dissoc } from 'ramda';
import DatePicker, { ReactDatePickerProps } from 'react-datepicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt as calendarIcon } from '@fortawesome/free-regular-svg-icons';
import classNames from 'classnames';
import moment from 'moment';
import './DateInput.scss';

interface DatePropsInterface {
  endDate?: moment.Moment | null;
  maxDate?: moment.Moment | null;
  minDate?: moment.Moment | null;
  selected?: moment.Moment | null;
  startDate?: moment.Moment | null;
  onChange?: (date: moment.Moment | null) => void;
}

export type DateInputProps = DatePropsInterface & Omit<ReactDatePickerProps, keyof DatePropsInterface>;

const transformProps = (props: DateInputProps): ReactDatePickerProps => ({
  // @ts-expect-error The DatePicker type definition is wrong. It has a ref prop
  ...dissoc('ref', props),
  endDate: props.endDate?.toDate(),
  maxDate: props.maxDate?.toDate(),
  minDate: props.minDate?.toDate(),
  selected: props.selected?.toDate(),
  startDate: props.startDate?.toDate(),
  onChange: (date: Date | null) => props.onChange?.(date && moment(date)),
});

const DateInput = (props: DateInputProps) => {
  const { className, isClearable, selected } = props;
  const showCalendarIcon = !isClearable || isNil(selected);
  const ref = useRef<{ input: HTMLInputElement }>();

  return (
    <div className="date-input-container">
      <DatePicker
        {...transformProps(props)}
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

export default DateInput;
