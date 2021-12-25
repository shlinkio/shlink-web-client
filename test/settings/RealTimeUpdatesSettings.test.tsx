import { shallow, ShallowWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import { Input } from 'reactstrap';
import {
  RealTimeUpdatesSettings as RealTimeUpdatesSettingsOptions,
  Settings,
} from '../../src/settings/reducers/settings';
import RealTimeUpdatesSettings from '../../src/settings/RealTimeUpdatesSettings';
import ToggleSwitch from '../../src/utils/ToggleSwitch';

describe('<RealTimeUpdatesSettings />', () => {
  const toggleRealTimeUpdates = jest.fn();
  const setRealTimeUpdatesInterval = jest.fn();
  let wrapper: ShallowWrapper;
  const createWrapper = (realTimeUpdates: Partial<RealTimeUpdatesSettingsOptions> = {}) => {
    const settings = Mock.of<Settings>({ realTimeUpdates });

    wrapper = shallow(
      <RealTimeUpdatesSettings
        settings={settings}
        toggleRealTimeUpdates={toggleRealTimeUpdates}
        setRealTimeUpdatesInterval={setRealTimeUpdatesInterval}
      />,
    );

    return wrapper;
  };

  afterEach(jest.clearAllMocks);
  afterEach(() => wrapper?.unmount());

  it('renders enabled real time updates as expected', () => {
    const wrapper = createWrapper({ enabled: true });
    const toggle = wrapper.find(ToggleSwitch);
    const label = wrapper.find('label');
    const input = wrapper.find(Input);
    const small = wrapper.find('small');

    expect(toggle.prop('checked')).toEqual(true);
    expect(toggle.html()).toContain('processed');
    expect(toggle.html()).not.toContain('ignored');
    expect(label.prop('className')).toEqual('');
    expect(input.prop('disabled')).toEqual(false);
    expect(small).toHaveLength(2);
  });

  it('renders disabled real time updates as expected', () => {
    const wrapper = createWrapper({ enabled: false });
    const toggle = wrapper.find(ToggleSwitch);
    const label = wrapper.find('label');
    const input = wrapper.find(Input);
    const small = wrapper.find('small');

    expect(toggle.prop('checked')).toEqual(false);
    expect(toggle.html()).not.toContain('processed');
    expect(toggle.html()).toContain('ignored');
    expect(label.prop('className')).toEqual('text-muted');
    expect(input.prop('disabled')).toEqual(true);
    expect(small).toHaveLength(1);
  });

  it.each([
    [ 1, 'minute' ],
    [ 2, 'minutes' ],
    [ 10, 'minutes' ],
    [ 100, 'minutes' ],
  ])('shows expected children when interval is greater than 0', (interval, minutesWord) => {
    const wrapper = createWrapper({ enabled: true, interval });
    const span = wrapper.find('span');
    const input = wrapper.find(Input);

    expect(span).toHaveLength(1);
    expect(span.html()).toEqual(
      `<span>Updates will be reflected in the UI every <b>${interval}</b> ${minutesWord}.</span>`,
    );
    expect(input.prop('value')).toEqual(`${interval}`);
  });

  it.each([[ undefined ], [ 0 ]])('shows expected children when interval is 0 or undefined', (interval) => {
    const wrapper = createWrapper({ enabled: true, interval });
    const span = wrapper.find('span');
    const small = wrapper.find('small').at(1);
    const input = wrapper.find(Input);

    expect(span).toHaveLength(0);
    expect(small.html()).toContain('Updates will be reflected in the UI as soon as they happen.');
    expect(input.prop('value')).toEqual('');
  });

  it('updates real time updates on input change', () => {
    const wrapper = createWrapper();
    const input = wrapper.find(Input);

    expect(setRealTimeUpdatesInterval).not.toHaveBeenCalled();
    input.simulate('change', { target: { value: '10' } });
    expect(setRealTimeUpdatesInterval).toHaveBeenCalledWith(10);
  });

  it('toggles real time updates on switch change', () => {
    const wrapper = createWrapper();
    const toggle = wrapper.find(ToggleSwitch);

    expect(toggleRealTimeUpdates).not.toHaveBeenCalled();
    toggle.simulate('change');
    expect(toggleRealTimeUpdates).toHaveBeenCalled();
  });
});
