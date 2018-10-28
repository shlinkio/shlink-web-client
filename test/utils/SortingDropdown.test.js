import React from 'react';
import { shallow } from 'enzyme';
import { DropdownItem } from 'reactstrap';
import { identity, values } from 'ramda';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import caretDownIcon from '@fortawesome/fontawesome-free-solid/faCaretDown';
import * as sinon from 'sinon';
import SortingDropdown from '../../src/utils/SortingDropdown';

describe('<SortingDropdown />', () => {
  let wrapper;
  const items = {
    foo: 'Foo',
    bar: 'Bar',
    baz: 'Hello World',
  };
  const createWrapper = (props) => {
    wrapper = shallow(<SortingDropdown items={items} onChange={identity} {...props} />);

    return wrapper;
  };

  afterEach(() => wrapper && wrapper.unmount());

  it('properly renders provided list of items', () => {
    const wrapper = createWrapper();
    const dropdownItems = wrapper.find(DropdownItem);
    const secondIndex = 2;
    const clearItemsCount = 2;

    expect(dropdownItems).toHaveLength(values(items).length + clearItemsCount);
    expect(dropdownItems.at(0).html()).toContain('Foo');
    expect(dropdownItems.at(1).html()).toContain('Bar');
    expect(dropdownItems.at(secondIndex).html()).toContain('Hello World');
  });

  it('properly marks selected field as active with proper icon', () => {
    const wrapper = createWrapper({ orderField: 'bar', orderDir: 'DESC' });
    const activeItem = wrapper.find('DropdownItem[active=true]');
    const activeItemIcon = activeItem.first().find(FontAwesomeIcon);

    expect(activeItem).toHaveLength(1);
    expect(activeItemIcon.prop('icon')).toEqual(caretDownIcon);
  });

  it('triggers change function when item is clicked and no order field was provided', () => {
    const onChange = sinon.spy();
    const wrapper = createWrapper({ onChange });
    const firstItem = wrapper.find(DropdownItem).first();

    firstItem.simulate('click');

    expect(onChange.callCount).toEqual(1);
    expect(onChange.calledWith('foo', 'ASC')).toEqual(true);
  });

  it('triggers change function when item is clicked and an order field was provided', () => {
    const onChange = sinon.spy();
    const wrapper = createWrapper({ onChange, orderField: 'baz', orderDir: 'ASC' });
    const firstItem = wrapper.find(DropdownItem).first();

    firstItem.simulate('click');

    expect(onChange.callCount).toEqual(1);
    expect(onChange.calledWith('foo', 'ASC')).toEqual(true);
  });

  it('updates order dir when already selected item is clicked', () => {
    const onChange = sinon.spy();
    const wrapper = createWrapper({ onChange, orderField: 'foo', orderDir: 'ASC' });
    const firstItem = wrapper.find(DropdownItem).first();

    firstItem.simulate('click');

    expect(onChange.callCount).toEqual(1);
    expect(onChange.calledWith('foo', 'DESC')).toEqual(true);
  });
});
