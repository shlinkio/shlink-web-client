import React from 'react';
import { shallow } from 'enzyme';
import DateInput from '../../src/common/DateInput';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import moment from 'moment';

describe('<DateInput />', () => {
  let wrapped;

  const createComponent = (props = {}) => {
    wrapped = shallow(<DateInput {...props} />);
    return wrapped;
  };
  afterEach(() => {
    if (wrapped !== undefined) {
      wrapped.unmount();
      wrapped = undefined;
    }
  });

  it('wrapps a DatePicker', () => {
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
