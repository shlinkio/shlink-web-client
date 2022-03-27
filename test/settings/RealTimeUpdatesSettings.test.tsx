import { shallow, ShallowWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import { Input } from 'reactstrap';
import { FormText } from '../../src/utils/forms/FormText';
import {
  RealTimeUpdatesSettings as RealTimeUpdatesSettingsOptions,
  Settings,
} from '../../src/settings/reducers/settings';
import RealTimeUpdatesSettings from '../../src/settings/RealTimeUpdatesSettings';
import ToggleSwitch from '../../src/utils/ToggleSwitch';
import { LabeledFormGroup } from '../../src/utils/forms/LabeledFormGroup';

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
    const label = wrapper.find(LabeledFormGroup);
    const input = wrapper.find(Input);
    const formText = wrapper.find(FormText);

    expect(toggle.prop('checked')).toEqual(true);
    expect(toggle.html()).toContain('processed');
    expect(toggle.html()).not.toContain('ignored');
    expect(label.prop('labelClassName')).not.toContain('text-muted');
    expect(input.prop('disabled')).toEqual(false);
    expect(formText).toHaveLength(2);
  });

  it('renders disabled real time updates as expected', () => {
    const wrapper = createWrapper({ enabled: false });
    const toggle = wrapper.find(ToggleSwitch);
    const label = wrapper.find(LabeledFormGroup);
    const input = wrapper.find(Input);
    const formText = wrapper.find(FormText);

    expect(toggle.prop('checked')).toEqual(false);
    expect(toggle.html()).not.toContain('processed');
    expect(toggle.html()).toContain('ignored');
    expect(label.prop('labelClassName')).toContain('text-muted');
    expect(input.prop('disabled')).toEqual(true);
    expect(formText).toHaveLength(1);
  });

  it.each([
    [1, 'minute'],
    [2, 'minutes'],
    [10, 'minutes'],
    [100, 'minutes'],
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

  it.each([[undefined], [0]])('shows expected children when interval is 0 or undefined', (interval) => {
    const wrapper = createWrapper({ enabled: true, interval });
    const span = wrapper.find('span');
    const formText = wrapper.find(FormText).at(1);
    const input = wrapper.find(Input);

    expect(span).toHaveLength(0);
    expect(formText.html()).toContain('Updates will be reflected in the UI as soon as they happen.');
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
