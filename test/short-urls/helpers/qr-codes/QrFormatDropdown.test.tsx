import { shallow, ShallowWrapper } from 'enzyme';
import { DropdownItem } from 'reactstrap';
import { QrCodeFormat } from '../../../../src/utils/helpers/qrCodes';
import { QrFormatDropdown } from '../../../../src/short-urls/helpers/qr-codes/QrFormatDropdown';

describe('<QrFormatDropdown />', () => {
  const initialFormat: QrCodeFormat = 'svg';
  const setFormat = jest.fn();
  let wrapper: ShallowWrapper;

  beforeEach(() => {
    wrapper = shallow(<QrFormatDropdown format={initialFormat} setFormat={setFormat} />);
  });

  afterEach(() => wrapper?.unmount());
  afterEach(jest.clearAllMocks);

  it('renders initial state', () => {
    const items = wrapper.find(DropdownItem);

    expect(wrapper.prop('text')).toEqual('Format (svg)');
    expect(items.at(0).prop('active')).toEqual(false);
    expect(items.at(1).prop('active')).toEqual(true);
  });

  it('invokes callback when items are clicked', () => {
    const items = wrapper.find(DropdownItem);

    expect(setFormat).not.toHaveBeenCalled();

    items.at(0).simulate('click');
    expect(setFormat).toHaveBeenCalledWith('png');

    items.at(1).simulate('click');
    expect(setFormat).toHaveBeenCalledWith('svg');
  });
});
