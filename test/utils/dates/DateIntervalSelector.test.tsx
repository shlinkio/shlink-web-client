import { shallow, ShallowWrapper } from 'enzyme';
import { DateInterval, rangeOrIntervalToString } from '../../../src/utils/dates/types';
import { DateIntervalSelector } from '../../../src/utils/dates/DateIntervalSelector';
import { DateIntervalDropdownItems } from '../../../src/utils/dates/DateIntervalDropdownItems';
import { DropdownBtn } from '../../../src/utils/DropdownBtn';

describe('<DateIntervalSelector />', () => {
  let wrapper: ShallowWrapper;
  const activeInterval: DateInterval = 'last7Days';
  const onChange = jest.fn();

  beforeEach(() => {
    wrapper = shallow(<DateIntervalSelector active={activeInterval} onChange={onChange} />);
  });
  afterEach(() => wrapper?.unmount());

  test('props are passed down to nested DateIntervalDropdownItems', () => {
    const items = wrapper.find(DateIntervalDropdownItems);
    const dropdown = wrapper.find(DropdownBtn);

    expect(dropdown.prop('text')).toEqual(rangeOrIntervalToString(activeInterval));
    expect(items).toHaveLength(1);
    expect(items.prop('onChange')).toEqual(onChange);
    expect(items.prop('active')).toEqual(activeInterval);
  });
});
