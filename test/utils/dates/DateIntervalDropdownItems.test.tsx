import { DropdownItem } from 'reactstrap';
import { shallow, ShallowWrapper } from 'enzyme';
import { DateIntervalDropdownItems } from '../../../src/utils/dates/DateIntervalDropdownItems';
import { DATE_INTERVALS } from '../../../src/utils/dates/types';

describe('<DateIntervalDropdownItems />', () => {
  let wrapper: ShallowWrapper;
  const onChange = jest.fn();

  beforeEach(() => {
    wrapper = shallow(<DateIntervalDropdownItems active="last180days" onChange={onChange} />);
  });

  afterEach(jest.clearAllMocks);
  afterEach(() => wrapper?.unmount());

  it('renders expected amount of items', () => {
    const items = wrapper.find(DropdownItem);

    expect(items).toHaveLength(DATE_INTERVALS.length);
  });

  it('sets expected item as active', () => {
    const items = wrapper.find(DropdownItem);
    const EXPECTED_ACTIVE_INDEX = 5;

    expect.assertions(DATE_INTERVALS.length);
    items.forEach((item, index) => expect(item.prop('active')).toEqual(index === EXPECTED_ACTIVE_INDEX));
  });

  it('triggers onChange callback when selecting an element', () => {
    const items = wrapper.find(DropdownItem);

    items.at(2).simulate('click');
    items.at(4).simulate('click');
    items.at(1).simulate('click');
    expect(onChange).toHaveBeenCalledTimes(3);
  });
});
