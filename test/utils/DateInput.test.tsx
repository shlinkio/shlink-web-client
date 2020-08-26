import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import { Mock } from 'ts-mockery';
import DateInput, { DateInputProps } from '../../src/utils/DateInput';

describe('<DateInput />', () => {
  let wrapped: ShallowWrapper;

  const createComponent = (props: Partial<DateInputProps> = {}) => {
    wrapped = shallow(<DateInput {...Mock.of<DateInputProps>(props)} />);

    return wrapped;
  };

  afterEach(() => wrapped?.unmount());

  it('wraps a DatePicker', () => {
    wrapped = createComponent();
  });

  it('shows calendar icon when input is not clearable', () => {
    wrapped = createComponent({ isClearable: false });
    expect(wrapped.find(FontAwesomeIcon)).toHaveLength(1);
  });

  it('shows calendar icon when input is clearable but selected value is nil', () => {
    wrapped = createComponent({ isClearable: true, selected: null });
    expect(wrapped.find(FontAwesomeIcon)).toHaveLength(1);
  });

  it('does not show calendar icon when input is clearable', () => {
    wrapped = createComponent({ isClearable: true, selected: moment() });
    expect(wrapped.find(FontAwesomeIcon)).toHaveLength(0);
  });
});
