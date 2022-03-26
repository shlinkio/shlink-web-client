import { shallow, ShallowWrapper } from 'enzyme';
import { DropdownMenu, DropdownToggle } from 'reactstrap';
import { PropsWithChildren } from 'react';
import { DropdownBtn, DropdownBtnProps } from '../../src/utils/DropdownBtn';

describe('<DropdownBtn />', () => {
  let wrapper: ShallowWrapper;
  const createWrapper = (props: PropsWithChildren<DropdownBtnProps>) => {
    wrapper = shallow(<DropdownBtn children="foo" {...props} />);

    return wrapper;
  };

  afterEach(() => wrapper?.unmount());

  it.each([['foo'], ['bar'], ['baz']])('displays provided text', (text) => {
    const wrapper = createWrapper({ text });
    const toggle = wrapper.find(DropdownToggle);

    expect(toggle.prop('children')).toContain(text);
  });

  it.each([['foo'], ['bar'], ['baz']])('displays provided children', (children) => {
    const wrapper = createWrapper({ text: '', children });
    const menu = wrapper.find(DropdownMenu);

    expect(menu.html()).toContain(children);
  });

  it.each([
    [undefined, 'dropdown-btn__toggle btn-block'],
    ['', 'dropdown-btn__toggle btn-block'],
    ['foo', 'dropdown-btn__toggle btn-block foo'],
    ['bar', 'dropdown-btn__toggle btn-block bar'],
  ])('includes provided classes', (className, expectedClasses) => {
    const wrapper = createWrapper({ text: '', className });
    const toggle = wrapper.find(DropdownToggle);

    expect(toggle.prop('className')?.trim()).toEqual(expectedClasses);
  });

  it.each([
    [100, { minWidth: '100px' }],
    [250, { minWidth: '250px' }],
    [undefined, {}],
  ])('renders proper styles when minWidth is provided', (minWidth, expectedStyle) => {
    const wrapper = createWrapper({ text: '', minWidth });
    const style = wrapper.find(DropdownMenu).prop('style');

    expect(style).toEqual(expectedStyle);
  });
});
