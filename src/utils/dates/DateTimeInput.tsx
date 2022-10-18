import { ReactDatePickerProps } from 'react-datepicker';
import { FC } from 'react';
import { DateInput } from '../DateInput';

export type DateTimeInputProps = Omit<ReactDatePickerProps, 'showTimeSelect' | 'dateFormat' | 'timeIntervals'>;

export const DateTimeInput: FC<DateTimeInputProps> = (props) => (
  <DateInput
    {...props}
    dateFormat="yyyy-MM-dd HH:mm"
    showTimeSelect
    timeIntervals={5}
  />
);
