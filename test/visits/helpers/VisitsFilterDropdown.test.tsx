import { shallow, ShallowWrapper } from 'enzyme';
import { DropdownItem } from 'reactstrap';
import { OrphanVisitType, VisitsFilter } from '../../../src/visits/types';
import { VisitsFilterDropdown } from '../../../src/visits/helpers/VisitsFilterDropdown';

describe('<VisitsFilterDropdown />', () => {
  let wrapper: ShallowWrapper;
  const onChange = jest.fn();
  const createWrapper = (selected: VisitsFilter = {}, isOrphanVisits = true) => {
    wrapper = shallow(
      <VisitsFilterDropdown
        isOrphanVisits={isOrphanVisits}
        botsSupported
        selected={selected}
        onChange={onChange}
      />,
    );

    return wrapper;
  };

  beforeEach(jest.clearAllMocks);
  afterEach(() => wrapper?.unmount());

  it('has expected text', () => {
    const wrapper = createWrapper();

    expect(wrapper.prop('text')).toEqual('Filters');
  });

  it.each([
    [false, 4, 1],
    [true, 9, 2],
  ])('renders expected amount of items', (isOrphanVisits, expectedItemsAmount, expectedHeadersAmount) => {
    const wrapper = createWrapper({}, isOrphanVisits);
    const items = wrapper.find(DropdownItem);
    const headers = items.filterWhere((item) => !!item.prop('header'));

    expect(items).toHaveLength(expectedItemsAmount);
    expect(headers).toHaveLength(expectedHeadersAmount);
  });

  it.each([
    ['base_url' as OrphanVisitType, 4, 1],
    ['invalid_short_url' as OrphanVisitType, 5, 1],
    ['regular_404' as OrphanVisitType, 6, 1],
    [undefined, -1, 0],
  ])('sets expected item as active', (orphanVisitsType, expectedSelectedIndex, expectedActiveItems) => {
    const wrapper = createWrapper({ orphanVisitsType });
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
    [1, { excludeBots: true }],
    [4, { orphanVisitsType: 'base_url' }],
    [5, { orphanVisitsType: 'invalid_short_url' }],
    [6, { orphanVisitsType: 'regular_404' }],
    [8, {}],
  ])('invokes onChange with proper selection when an item is clicked', (index, expectedSelection) => {
    const wrapper = createWrapper();
    const itemToClick = wrapper.find(DropdownItem).at(index);

    itemToClick.simulate('click');

    expect(onChange).toHaveBeenCalledWith(expectedSelection);
  });

  it('does not render the component when neither orphan visits or bots filtering will be displayed', () => {
    const wrapper = shallow(
      <VisitsFilterDropdown
        isOrphanVisits={false}
        botsSupported={false}
        selected={{}}
        onChange={onChange}
      />,
    );

    expect(wrapper.text()).toEqual('');
  });
});
