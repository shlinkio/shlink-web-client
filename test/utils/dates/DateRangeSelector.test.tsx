import { shallow, ShallowWrapper } from 'enzyme';
import { DropdownItem } from 'reactstrap';
import { Mock } from 'ts-mockery';
import { DateRangeSelector, DateRangeSelectorProps } from '../../../src/utils/dates/DateRangeSelector';
import { DateInterval } from '../../../src/utils/dates/types';
import { DateIntervalDropdownItems } from '../../../src/utils/dates/DateIntervalDropdownItems';
import DateRangeRow from '../../../src/utils/dates/DateRangeRow';

describe('<DateRangeSelector />', () => {
  let wrapper: ShallowWrapper;
  const onDatesChange = jest.fn();
  const createWrapper = (props: Partial<DateRangeSelectorProps> = {}) => {
    wrapper = shallow(
      <DateRangeSelector
        {...Mock.of<DateRangeSelectorProps>(props)}
        defaultText="Default text"
        onDatesChange={onDatesChange}
      />,
    );

    return wrapper;
  };

  afterEach(jest.clearAllMocks);
  afterEach(() => wrapper?.unmount());

  it('renders proper amount of items', () => {
    const wrapper = createWrapper();
    const items = wrapper.find(DropdownItem);
    const dateIntervalItems = wrapper.find(DateIntervalDropdownItems);

    expect(items).toHaveLength(3);
    expect(dateIntervalItems).toHaveLength(1);
    expect(items.filter('[divider]')).toHaveLength(1);
    expect(items.filter('[header]')).toHaveLength(1);
    expect(items.filter('[text]')).toHaveLength(1);
  });

  it.each([
    [undefined, 0],
    ['all' as DateInterval, 1],
    ['today' as DateInterval, 1],
    ['yesterday' as DateInterval, 1],
    ['last7Days' as DateInterval, 1],
    ['last30Days' as DateInterval, 1],
    ['last90Days' as DateInterval, 1],
    ['last180Days' as DateInterval, 1],
    ['last365Days' as DateInterval, 1],
    [{ startDate: new Date() }, 0],
  ])('sets proper element as active based on provided date range', (initialDateRange, expectedActiveIntervalItems) => {
    const wrapper = createWrapper({ initialDateRange });
    const dateIntervalItems = wrapper.find(DateIntervalDropdownItems).filterWhere(
      (item) => item.prop('active') !== undefined,
    );

    expect(dateIntervalItems).toHaveLength(expectedActiveIntervalItems);
  });

  it('triggers onDatesChange callback when selecting an element', () => {
    const wrapper = createWrapper();
    const dates = wrapper.find(DateRangeRow);
    const dateIntervalItems = wrapper.find(DateIntervalDropdownItems);

    dates.simulate('startDateChange', null);
    dates.simulate('endDateChange', null);
    dateIntervalItems.simulate('change');
    expect(onDatesChange).toHaveBeenCalledTimes(3);
  });

  it('propagates default text to DateIntervalDropdownItems', () => {
    const wrapper = createWrapper();
    const dateIntervalItems = wrapper.find(DateIntervalDropdownItems);

    expect(dateIntervalItems.prop('allText')).toEqual('Default text');
  });
});
