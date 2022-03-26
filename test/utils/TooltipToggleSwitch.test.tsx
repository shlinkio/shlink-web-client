import { shallow, ShallowWrapper } from 'enzyme';
import { PropsWithChildren } from 'react';
import { UncontrolledTooltip } from 'reactstrap';
import { TooltipToggleSwitch, TooltipToggleSwitchProps } from '../../src/utils/TooltipToggleSwitch';
import ToggleSwitch from '../../src/utils/ToggleSwitch';

describe('<TooltipToggleSwitch />', () => {
  let wrapper: ShallowWrapper;
  const createWrapper = (props: PropsWithChildren<TooltipToggleSwitchProps> = {}) => {
    wrapper = shallow(<TooltipToggleSwitch {...props} />);

    return wrapper;
  };

  afterEach(() => wrapper?.unmount());

  it.each([
    ['foo'],
    ['bar'],
    ['baz'],
  ])('shows children inside tooltip', (children) => {
    const wrapper = createWrapper({ children });
    const tooltip = wrapper.find(UncontrolledTooltip);

    expect(tooltip.prop('children')).toEqual(children);
  });

  it('properly propagates corresponding props to every component', () => {
    const expectedTooltipProps = { placement: 'left', delay: 30 };
    const expectedToggleProps = { checked: true, className: 'foo' };
    const wrapper = createWrapper({ tooltip: expectedTooltipProps, ...expectedToggleProps });
    const tooltip = wrapper.find(UncontrolledTooltip);
    const toggle = wrapper.find(ToggleSwitch);

    expect(tooltip.props()).toEqual(expect.objectContaining(expectedTooltipProps));
    expect(toggle.props()).toEqual(expect.objectContaining(expectedToggleProps));
  });
});
