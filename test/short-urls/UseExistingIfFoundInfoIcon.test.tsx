import { mount, ReactWrapper } from 'enzyme';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal } from 'reactstrap';
import UseExistingIfFoundInfoIcon from '../../src/short-urls/UseExistingIfFoundInfoIcon';

describe('<UseExistingIfFoundInfoIcon />', () => {
  let wrapped: ReactWrapper;

  beforeEach(() => {
    wrapped = mount(<UseExistingIfFoundInfoIcon />);
  });

  afterEach(() => wrapped.unmount());

  it('shows modal when icon is clicked', () => {
    const icon = wrapped.find(FontAwesomeIcon);

    expect(wrapped.find(Modal).prop('isOpen')).toEqual(false);
    icon.simulate('click');
    expect(wrapped.find(Modal).prop('isOpen')).toEqual(true);
  });
});
