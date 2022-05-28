import { shallow, ShallowWrapper } from 'enzyme';
import { DateRangeRow } from '../../../src/utils/dates/DateRangeRow';
import { DateInput } from '../../../src/utils/DateInput';

describe('<DateRangeRow />', () => {
  let wrapper: ShallowWrapper;
  const onEndDateChange = jest.fn();
  const onStartDateChange = jest.fn();

  beforeEach(() => {
    wrapper = shallow(<DateRangeRow onEndDateChange={onEndDateChange} onStartDateChange={onStartDateChange} />);
  });
  afterEach(() => {
    wrapper.unmount();
    jest.clearAllMocks();
  });

  it('renders two date inputs', () => {
    const dateInput = wrapper.find(DateInput);

    expect(dateInput).toHaveLength(2);
  });

  it('invokes start date callback when change event is triggered on first input', () => {
    const dateInput = wrapper.find(DateInput).first();

    expect(onStartDateChange).not.toHaveBeenCalled();
    dateInput.simulate('change');
    expect(onStartDateChange).toHaveBeenCalled();
  });

  it('invokes end date callback when change event is triggered on second input', () => {
    const dateInput = wrapper.find(DateInput).last();

    expect(onEndDateChange).not.toHaveBeenCalled();
    dateInput.simulate('change');
    expect(onEndDateChange).toHaveBeenCalled();
  });
});
