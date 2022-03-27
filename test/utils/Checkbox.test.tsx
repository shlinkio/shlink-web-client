import { ChangeEvent, PropsWithChildren } from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import Checkbox from '../../src/utils/Checkbox';
import { BooleanControlProps } from '../../src/utils/BooleanControl';

describe('<Checkbox />', () => {
  let wrapped: ReactWrapper;

  const createComponent = (props: PropsWithChildren<BooleanControlProps> = {}) => {
    wrapped = mount(<Checkbox {...props} />);

    return wrapped;
  };

  afterEach(() => wrapped?.unmount());

  it('includes extra class names when provided', () => {
    const classNames = ['foo', 'bar', 'baz'];

    expect.assertions(classNames.length);
    classNames.forEach((className) => {
      const wrapped = createComponent({ className });

      expect(wrapped.prop('className')).toContain(className);
    });
  });

  it('marks input as checked if defined', () => {
    const checkeds = [true, false];

    expect.assertions(checkeds.length);
    checkeds.forEach((checked) => {
      const wrapped = createComponent({ checked });
      const input = wrapped.find('input');

      expect(input.prop('checked')).toEqual(checked);
    });
  });

  it('renders provided children inside the label', () => {
    const labels = ['foo', 'bar', 'baz'];

    expect.assertions(labels.length);
    labels.forEach((children) => {
      const wrapped = createComponent({ children });
      const label = wrapped.find('label');

      expect(label.text()).toEqual(children);
    });
  });

  it('changes checked status on input change', () => {
    const onChange = jest.fn();
    const e = Mock.of<ChangeEvent<HTMLInputElement>>({ target: { checked: false } });
    const wrapped = createComponent({ checked: true, onChange });
    const input = wrapped.find('input');

    (input.prop('onChange') as Function)(e);

    expect(onChange).toHaveBeenCalledWith(false, e);
  });

  it('allows setting inline rendering', () => {
    const wrapped = createComponent({ inline: true });
    const control = wrapped.find('.form-check');

    expect(control.prop('style')).toEqual({ display: 'inline-block' });
  });
});
