import { shallow, ShallowWrapper } from 'enzyme';
import { DropdownMenu, DropdownToggle } from 'reactstrap';
import { PropsWithChildren } from 'react';
import { Dropdown, DropdownProps } from '../../src/utils/Dropdown';

describe('<Dropdown />', () => {
  let wrapper: ShallowWrapper;
  const createWrapper = (props: PropsWithChildren<DropdownProps>) => {
    wrapper = shallow(<Dropdown {...props} />);

    return wrapper;
  };

  afterEach(() => wrapper?.unmount());

  it.each([[ 'foo' ], [ 'bar' ], [ 'baz' ]])('displays provided text', (text) => {
    const wrapper = createWrapper({ text });
    const toggle = wrapper.find(DropdownToggle);

    expect(toggle.html()).toContain(text);
  });

  it.each([[ 'foo' ], [ 'bar' ], [ 'baz' ]])('displays provided children', (children) => {
    const wrapper = createWrapper({ text: '', children });
    const menu = wrapper.find(DropdownMenu);

    expect(menu.html()).toContain(children);
  });

  it.each([
    [ undefined, 'dropdown__btn btn-block' ],
    [ '', 'dropdown__btn btn-block' ],
    [ 'foo', 'dropdown__btn btn-block foo' ],
    [ 'bar', 'dropdown__btn btn-block bar' ],
  ])('includes provided classes', (className, expectedClasses) => {
    const wrapper = createWrapper({ text: '', className });
    const toggle = wrapper.find(DropdownToggle);

    expect(toggle.prop('className')?.trim()).toEqual(expectedClasses);
  });
});
