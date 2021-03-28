import { shallow, ShallowWrapper } from 'enzyme';
import { DropdownItem } from 'reactstrap';
import { OrphanVisitType } from '../../../src/visits/types';
import { OrphanVisitTypeDropdown } from '../../../src/visits/helpers/OrphanVisitTypeDropdown';

describe('<OrphanVisitTypeDropdown />', () => {
  let wrapper: ShallowWrapper;
  const onChange = jest.fn();
  const createWrapper = (selected?: OrphanVisitType) => {
    wrapper = shallow(<OrphanVisitTypeDropdown text="The text" selected={selected} onChange={onChange} />);

    return wrapper;
  };

  beforeEach(jest.clearAllMocks);
  afterEach(() => wrapper?.unmount());

  it('has provided text', () => {
    const wrapper = createWrapper();

    expect(wrapper.prop('text')).toEqual('The text');
  });

  it.each([
    [ 'base_url' as OrphanVisitType, 0, 1 ],
    [ 'invalid_short_url' as OrphanVisitType, 1, 1 ],
    [ 'regular_404' as OrphanVisitType, 2, 1 ],
    [ undefined, -1, 0 ],
  ])('sets expected item as active', (selected, expectedSelectedIndex, expectedActiveItems) => {
    const wrapper = createWrapper(selected);
    const items = wrapper.find(DropdownItem);
    const activeItem = items.filterWhere((item) => !!item.prop('active'));

    expect.assertions(expectedActiveItems + 1);
    expect(activeItem).toHaveLength(expectedActiveItems);
    items.forEach((item, index) => {
      if (item.prop('active')) {
        expect(index).toEqual(expectedSelectedIndex);
      }
    });
  });

  it.each([
    [ 0, 'base_url' ],
    [ 1, 'invalid_short_url' ],
    [ 2, 'regular_404' ],
    [ 4, undefined ],
  ])('invokes onChange with proper type when an item is clicked', (index, expectedType) => {
    const wrapper = createWrapper();
    const itemToClick = wrapper.find(DropdownItem).at(index);

    itemToClick.simulate('click');

    expect(onChange).toHaveBeenCalledWith(expectedType);
  });
});
