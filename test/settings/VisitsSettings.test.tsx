import { shallow, ShallowWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import { Settings } from '../../src/settings/reducers/settings';
import { VisitsSettings } from '../../src/settings/VisitsSettings';
import { SimpleCard } from '../../src/utils/SimpleCard';
import { DateIntervalSelector } from '../../src/utils/dates/DateIntervalSelector';
import { LabeledFormGroup } from '../../src/utils/forms/LabeledFormGroup';

describe('<VisitsSettings />', () => {
  let wrapper: ShallowWrapper;
  const setVisitsSettings = jest.fn();
  const createWrapper = (settings: Partial<Settings> = {}) => {
    wrapper = shallow(<VisitsSettings settings={Mock.of<Settings>(settings)} setVisitsSettings={setVisitsSettings} />);

    return wrapper;
  };

  afterEach(jest.clearAllMocks);
  afterEach(() => wrapper?.unmount());

  it('renders expected components', () => {
    const wrapper = createWrapper();

    expect(wrapper.find(SimpleCard).prop('title')).toEqual('Visits');
    expect(wrapper.find(LabeledFormGroup).prop('label')).toEqual('Default interval to load on visits sections:');
    expect(wrapper.find(DateIntervalSelector)).toHaveLength(1);
  });

  it.each([
    [Mock.all<Settings>(), 'last30Days'],
    [Mock.of<Settings>({ visits: {} }), 'last30Days'],
    [
      Mock.of<Settings>({
        visits: {
          defaultInterval: 'last7Days',
        },
      }),
      'last7Days',
    ],
    [
      Mock.of<Settings>({
        visits: {
          defaultInterval: 'today',
        },
      }),
      'today',
    ],
  ])('sets expected interval as active', (settings, expectedInterval) => {
    const wrapper = createWrapper(settings);

    expect(wrapper.find(DateIntervalSelector).prop('active')).toEqual(expectedInterval);
  });

  it('invokes setVisitsSettings when interval changes', () => {
    const wrapper = createWrapper();
    const selector = wrapper.find(DateIntervalSelector);

    selector.simulate('change', 'last7Days');
    selector.simulate('change', 'last180Days');
    selector.simulate('change', 'yesterday');

    expect(setVisitsSettings).toHaveBeenCalledTimes(3);
    expect(setVisitsSettings).toHaveBeenNthCalledWith(1, { defaultInterval: 'last7Days' });
    expect(setVisitsSettings).toHaveBeenNthCalledWith(2, { defaultInterval: 'last180Days' });
    expect(setVisitsSettings).toHaveBeenNthCalledWith(3, { defaultInterval: 'yesterday' });
  });
});
