import { shallow, ShallowWrapper } from 'enzyme';
import { Button } from 'reactstrap';
import { AppUpdateBanner } from '../../src/common/AppUpdateBanner';
import { SimpleCard } from '../../src/utils/SimpleCard';

describe('<AppUpdateBanner />', () => {
  const toggle = jest.fn();
  const forceUpdate = jest.fn();
  let wrapper: ShallowWrapper;

  beforeEach(() => {
    wrapper = shallow(<AppUpdateBanner isOpen toggle={toggle} forceUpdate={forceUpdate} />);
  });

  afterEach(jest.clearAllMocks);
  afterEach(() => wrapper?.unmount());

  it('renders an alert with expected props', () => {
    expect(wrapper.prop('className')).toEqual('app-update-banner');
    expect(wrapper.prop('isOpen')).toEqual(true);
    expect(wrapper.prop('toggle')).toEqual(toggle);
    expect(wrapper.prop('tag')).toEqual(SimpleCard);
    expect(wrapper.prop('color')).toEqual('secondary');
  });

  it('invokes toggle when alert is toggled', () => {
    (wrapper.prop('toggle') as Function)();

    expect(toggle).toHaveBeenCalled();
  });

  it('triggers the update when clicking the button', () => {
    expect(wrapper.find(Button).html()).toContain('Restart now');
    expect(wrapper.find(Button).prop('disabled')).toEqual(false);
    expect(forceUpdate).not.toHaveBeenCalled();

    wrapper.find(Button).simulate('click');

    expect(wrapper.find(Button).html()).toContain('Restarting...');
    expect(wrapper.find(Button).prop('disabled')).toEqual(true);
    expect(forceUpdate).toHaveBeenCalled();
  });
});
