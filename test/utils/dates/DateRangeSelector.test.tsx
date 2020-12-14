import { shallow, ShallowWrapper } from 'enzyme';
import { DropdownItem } from 'reactstrap';
import moment from 'moment';
import { DateRangeSelector, DateRangeSelectorProps } from '../../../src/utils/dates/DateRangeSelector';
import { DateInterval } from '../../../src/utils/dates/types';

describe('<DateRangeSelector />', () => {
  let wrapper: ShallowWrapper;
  const onDatesChange = jest.fn();
  const createWrapper = (props: Partial<DateRangeSelectorProps> = {}) => {
    wrapper = shallow(<DateRangeSelector {...props} onDatesChange={onDatesChange} />);

    return wrapper;
  };

  afterEach(jest.clearAllMocks);
  afterEach(() => wrapper?.unmount());

  test('proper amount of items is rendered', () => {
    const wrapper = createWrapper();
    const items = wrapper.find(DropdownItem);

    expect(items).toHaveLength(12);
    expect(items.filter('[divider]')).toHaveLength(2);
    expect(items.filter('[header]')).toHaveLength(1);
    expect(items.filter('[text]')).toHaveLength(1);
    expect(items.filter('[active]')).toHaveLength(8);
  });

  test.each([
    [ undefined, 0 ],
    [ 'today' as DateInterval, 1 ],
    [ 'yesterday' as DateInterval, 2 ],
    [ 'last7Days' as DateInterval, 3 ],
    [ 'last30Days' as DateInterval, 4 ],
    [ 'last90Days' as DateInterval, 5 ],
    [ 'last180days' as DateInterval, 6 ],
    [ 'last365Days' as DateInterval, 7 ],
    [{ startDate: moment() }, 8 ],
  ])('proper element is active based on provided date range', (initialDateRange, expectedActiveIndex) => {
    const wrapper = createWrapper({ initialDateRange });
    const items = wrapper.find(DropdownItem).filter('[active]');

    expect.assertions(8);
    items.forEach((item, index) => expect(item.prop('active')).toEqual(index === expectedActiveIndex));
  });

  test('selecting an element triggers onDatesChange callback', () => {
    const wrapper = createWrapper();
    const items = wrapper.find(DropdownItem).filter('[active]');

    items.at(2).simulate('click');
    items.at(4).simulate('click');
    items.at(1).simulate('click');
    expect(onDatesChange).toHaveBeenCalledTimes(3);
  });
});
