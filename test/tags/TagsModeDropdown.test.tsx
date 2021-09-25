import { shallow, ShallowWrapper } from 'enzyme';
import { DropdownItem } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars as listIcon, faThLarge as cardsIcon } from '@fortawesome/free-solid-svg-icons';
import { TagsModeDropdown } from '../../src/tags/TagsModeDropdown';
import { DropdownBtn } from '../../src/utils/DropdownBtn';

describe('<TagsModeDropdown />', () => {
  const onChange = jest.fn();
  let wrapper: ShallowWrapper;

  beforeEach(() => {
    wrapper = shallow(<TagsModeDropdown mode="list" onChange={onChange} />);
  });

  afterEach(jest.clearAllMocks);
  afterEach(() => wrapper?.unmount());

  it('renders expected items', () => {
    const btn = wrapper.find(DropdownBtn);
    const items = wrapper.find(DropdownItem);
    const icons = wrapper.find(FontAwesomeIcon);

    expect(btn).toHaveLength(1);
    expect(btn.prop('text')).toEqual('Display mode: list');
    expect(items).toHaveLength(2);
    expect(icons).toHaveLength(2);
    expect(icons.first().prop('icon')).toEqual(cardsIcon);
    expect(icons.last().prop('icon')).toEqual(listIcon);
  });

  it('changes active element on click', () => {
    const items = wrapper.find(DropdownItem);

    expect(onChange).not.toHaveBeenCalled();
    items.first().simulate('click');
    expect(onChange).toHaveBeenCalledWith('cards');

    items.last().simulate('click');
    expect(onChange).toHaveBeenCalledWith('list');
  });
});
