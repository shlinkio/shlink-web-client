import { shallow, ShallowWrapper } from 'enzyme';
import { DropdownItem } from 'reactstrap';
import PaginationDropdown from '../../src/utils/PaginationDropdown';

describe('<PaginationDropdown />', () => {
  const setValue = jest.fn();
  let wrapper: ShallowWrapper;

  beforeEach(() => {
    wrapper = shallow(<PaginationDropdown ranges={[ 10, 50, 100, 200 ]} value={50} setValue={setValue} />);
  });

  afterEach(jest.clearAllMocks);
  afterEach(() => wrapper?.unmount());

  test('expected amount of items is rendered', () => {
    const items = wrapper.find(DropdownItem);

    expect(items).toHaveLength(6);
  });

  test.each([
    [ 0, 10 ],
    [ 1, 50 ],
    [ 2, 100 ],
    [ 3, 200 ],
    [ 5, Infinity ],
  ])('expected value is set when an item is clicked', (index, expectedValue) => {
    const item = wrapper.find(DropdownItem).at(index);

    expect(setValue).not.toHaveBeenCalled();
    item.simulate('click');
    expect(setValue).toHaveBeenCalledWith(expectedValue);
  });
});
