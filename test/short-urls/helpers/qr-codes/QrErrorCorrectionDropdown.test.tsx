import { shallow, ShallowWrapper } from 'enzyme';
import { DropdownItem } from 'reactstrap';
import { QrErrorCorrection } from '../../../../src/utils/helpers/qrCodes';
import { QrErrorCorrectionDropdown } from '../../../../src/short-urls/helpers/qr-codes/QrErrorCorrectionDropdown';

describe('<QrErrorCorrectionDropdown />', () => {
  const initialErrorCorrection: QrErrorCorrection = 'Q';
  const setErrorCorrection = jest.fn();
  let wrapper: ShallowWrapper;

  beforeEach(() => {
    wrapper = shallow(
      <QrErrorCorrectionDropdown errorCorrection={initialErrorCorrection} setErrorCorrection={setErrorCorrection} />,
    );
  });

  afterEach(() => wrapper?.unmount());
  afterEach(jest.clearAllMocks);

  it('renders initial state', () => {
    const items = wrapper.find(DropdownItem);

    expect(wrapper.prop('text')).toEqual('Error correction (Q)');
    expect(items.at(0).prop('active')).toEqual(false);
    expect(items.at(1).prop('active')).toEqual(false);
    expect(items.at(2).prop('active')).toEqual(true);
    expect(items.at(3).prop('active')).toEqual(false);
  });

  it('invokes callback when items are clicked', () => {
    const items = wrapper.find(DropdownItem);

    expect(setErrorCorrection).not.toHaveBeenCalled();

    items.at(0).simulate('click');
    expect(setErrorCorrection).toHaveBeenCalledWith('L');

    items.at(1).simulate('click');
    expect(setErrorCorrection).toHaveBeenCalledWith('M');

    items.at(2).simulate('click');
    expect(setErrorCorrection).toHaveBeenCalledWith('Q');

    items.at(3).simulate('click');
    expect(setErrorCorrection).toHaveBeenCalledWith('H');
  });
});
