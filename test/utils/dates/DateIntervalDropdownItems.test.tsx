import { DropdownItem } from 'reactstrap';
import { shallow, ShallowWrapper } from 'enzyme';
import { DateIntervalDropdownItems } from '../../../src/utils/dates/DateIntervalDropdownItems';
import { DATE_INTERVALS } from '../../../src/utils/dates/types';

describe('<DateIntervalDropdownItems />', () => {
  let wrapper: ShallowWrapper;
  const onChange = jest.fn();

  beforeEach(() => {
    wrapper = shallow(<DateIntervalDropdownItems allText="All" active="last180days" onChange={onChange} />);
  });

  afterEach(jest.clearAllMocks);
  afterEach(() => wrapper?.unmount());

  it('renders expected amount of items', () => {
    const items = wrapper.find(DropdownItem);
    const dividerItems = items.findWhere((item) => !!item.prop('divider'));

    expect(items).toHaveLength(DATE_INTERVALS.length + 2);
    expect(dividerItems).toHaveLength(1);
  });

  it('sets expected item as active', () => {
    const items = wrapper.find(DropdownItem).findWhere((item) => item.prop('active') !== undefined);
    const EXPECTED_ACTIVE_INDEX = 6;

    expect.assertions(DATE_INTERVALS.length + 1);
    items.forEach((item, index) => expect(item.prop('active')).toEqual(index === EXPECTED_ACTIVE_INDEX));
  });

  it('triggers onChange callback when selecting an element', () => {
    const items = wrapper.find(DropdownItem);

    items.at(4).simulate('click');
    items.at(6).simulate('click');
    items.at(3).simulate('click');
    expect(onChange).toHaveBeenCalledTimes(3);
  });
});
