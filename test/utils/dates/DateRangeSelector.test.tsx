import { shallow, ShallowWrapper } from 'enzyme';
import { DropdownItem } from 'reactstrap';
import moment from 'moment';
import { Mock } from 'ts-mockery';
import { DateRangeSelector, DateRangeSelectorProps } from '../../../src/utils/dates/DateRangeSelector';
import { DateInterval } from '../../../src/utils/dates/types';
import { DateIntervalDropdownItems } from '../../../src/utils/dates/DateIntervalDropdownItems';

describe('<DateRangeSelector />', () => {
  let wrapper: ShallowWrapper;
  const onDatesChange = jest.fn();
  const createWrapper = (props: Partial<DateRangeSelectorProps> = {}) => {
    wrapper = shallow(<DateRangeSelector {...Mock.of<DateRangeSelectorProps>(props)} onDatesChange={onDatesChange} />);

    return wrapper;
  };

  afterEach(jest.clearAllMocks);
  afterEach(() => wrapper?.unmount());

  it('renders proper amount of items', () => {
    const wrapper = createWrapper();
    const items = wrapper.find(DropdownItem);
    const dateIntervalItems = wrapper.find(DateIntervalDropdownItems);

    expect(items).toHaveLength(5);
    expect(dateIntervalItems).toHaveLength(1);
    expect(items.filter('[divider]')).toHaveLength(2);
    expect(items.filter('[header]')).toHaveLength(1);
    expect(items.filter('[text]')).toHaveLength(1);
    expect(items.filter('[active]')).toHaveLength(1);
  });

  it.each([
    [ undefined, 1, 0 ],
    [ 'today' as DateInterval, 0, 1 ],
    [ 'yesterday' as DateInterval, 0, 1 ],
    [ 'last7Days' as DateInterval, 0, 1 ],
    [ 'last30Days' as DateInterval, 0, 1 ],
    [ 'last90Days' as DateInterval, 0, 1 ],
    [ 'last180days' as DateInterval, 0, 1 ],
    [ 'last365Days' as DateInterval, 0, 1 ],
    [{ startDate: moment() }, 0, 0 ],
  ])('sets proper element as active based on provided date range', (
    initialDateRange,
    expectedActiveItems,
    expectedActiveIntervalItems,
  ) => {
    const wrapper = createWrapper({ initialDateRange });
    const items = wrapper.find(DropdownItem).filterWhere((item) => item.prop('active') === true);
    const dateIntervalItems = wrapper.find(DateIntervalDropdownItems).filterWhere(
      (item) => item.prop('active') !== undefined,
    );

    expect(items).toHaveLength(expectedActiveItems);
    expect(dateIntervalItems).toHaveLength(expectedActiveIntervalItems);
  });

  it('triggers onDatesChange callback when selecting an element', () => {
    const wrapper = createWrapper();
    const item = wrapper.find(DropdownItem).at(0);
    const dateIntervalItems = wrapper.find(DateIntervalDropdownItems);

    item.simulate('click');
    item.simulate('click');
    dateIntervalItems.simulate('change');
    expect(onDatesChange).toHaveBeenCalledTimes(3);
  });
});
