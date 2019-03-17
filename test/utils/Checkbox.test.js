import React from 'react';
import { mount } from 'enzyme';
import Checkbox from '../../src/utils/Checkbox';

describe('<Checkbox />', () => {
  let wrapped;

  const createComponent = (props = {}) => {
    wrapped = mount(<Checkbox {...props} />);

    return wrapped;
  };

  afterEach(() => wrapped && wrapped.unmount());

  it('includes extra class names when provided', () => {
    const classNames = [ 'foo', 'bar', 'baz' ];
    const checked = false;
    const onChange = () => {};

    expect.assertions(classNames.length);
    classNames.forEach((className) => {
      const wrapped = createComponent({ className, checked, onChange });

      expect(wrapped.prop('className')).toContain(className);
    });
  });

  it('marks input as checked if defined', () => {
    const checkeds = [ true, false ];
    const onChange = () => {};

    expect.assertions(checkeds.length);
    checkeds.forEach((checked) => {
      const wrapped = createComponent({ checked, onChange });
      const input = wrapped.find('input');

      expect(input.prop('checked')).toEqual(checked);
    });
  });

  it('renders provided children inside the label', () => {
    const labels = [ 'foo', 'bar', 'baz' ];
    const checked = false;
    const onChange = () => {};

    expect.assertions(labels.length);
    labels.forEach((children) => {
      const wrapped = createComponent({ children, checked, onChange });
      const label = wrapped.find('label');

      expect(label.text()).toEqual(children);
    });
  });

  it('changes checked status on input change', () => {
    const onChange = jest.fn();
    const e = { target: { checked: false } };
    const wrapped = createComponent({ checked: true, onChange });
    const input = wrapped.find('input');

    input.prop('onChange')(e);

    expect(onChange).toHaveBeenCalledWith(false, e);
  });
});
