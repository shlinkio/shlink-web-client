import { shallow, ShallowWrapper } from 'enzyme';
import { UncontrolledTooltip } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck, faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { DomainStatus } from '../../../src/domains/data';
import { DomainStatusIcon } from '../../../src/domains/helpers/DomainStatusIcon';

describe('<DomainStatusIcon />', () => {
  let wrapper: ShallowWrapper;
  const createWrapper = (status: DomainStatus) => {
    wrapper = shallow(<DomainStatusIcon status={status} />);

    return wrapper;
  };

  afterEach(() => wrapper?.unmount());

  it('renders loading icon when status is "validating"', () => {
    const wrapper = createWrapper('validating');
    const tooltip = wrapper.find(UncontrolledTooltip);
    const faIcon = wrapper.find(FontAwesomeIcon);

    expect(tooltip).toHaveLength(0);
    expect(faIcon).toHaveLength(1);
    expect(faIcon.prop('icon')).toEqual(faCircleNotch);
    expect(faIcon.prop('spin')).toEqual(true);
  });

  it.each([
    [
      'invalid' as DomainStatus,
      faTimes,
      'Oops! There is some missing configuration, and short URLs shared with this domain will not work.',
    ],
    [ 'valid' as DomainStatus, faCheck, 'Congratulations! This domain is properly configured.' ],
  ])('renders expected icon and tooltip when status is not validating', (status, expectedIcon, expectedText) => {
    const wrapper = createWrapper(status);
    const tooltip = wrapper.find(UncontrolledTooltip);
    const faIcon = wrapper.find(FontAwesomeIcon);
    const getTooltipText = (): string => {
      const children = tooltip.prop('children');

      if (typeof children === 'string') {
        return children;
      }

      return tooltip.find('span').html();
    };

    expect(tooltip).toHaveLength(1);
    expect(tooltip.prop('autohide')).toEqual(status === 'valid');
    expect(getTooltipText()).toContain(expectedText);
    expect(faIcon).toHaveLength(1);
    expect(faIcon.prop('icon')).toEqual(expectedIcon);
    expect(faIcon.prop('spin')).toEqual(false);
  });
});
