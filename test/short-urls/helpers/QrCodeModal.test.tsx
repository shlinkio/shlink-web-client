import { shallow, ShallowWrapper } from 'enzyme';
import { ExternalLink } from 'react-external-link';
import { Button, FormGroup, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import { Mock } from 'ts-mockery';
import createQrCodeModal from '../../../src/short-urls/helpers/QrCodeModal';
import { ShortUrl } from '../../../src/short-urls/data';
import { ReachableServer } from '../../../src/servers/data';
import { CopyToClipboardIcon } from '../../../src/utils/CopyToClipboardIcon';
import { SemVer } from '../../../src/utils/helpers/version';
import { ImageDownloader } from '../../../src/common/services/ImageDownloader';
import { QrFormatDropdown } from '../../../src/short-urls/helpers/qr-codes/QrFormatDropdown';
import { QrErrorCorrectionDropdown } from '../../../src/short-urls/helpers/qr-codes/QrErrorCorrectionDropdown';

describe('<QrCodeModal />', () => {
  let wrapper: ShallowWrapper;
  const saveImage = jest.fn().mockReturnValue(Promise.resolve());
  const QrCodeModal = createQrCodeModal(Mock.of<ImageDownloader>({ saveImage }), () => null);
  const shortUrl = 'https://doma.in/abc123';
  const createWrapper = (version: SemVer = '2.6.0') => {
    const selectedServer = Mock.of<ReachableServer>({ version });

    wrapper = shallow(
      <QrCodeModal
        shortUrl={Mock.of<ShortUrl>({ shortUrl })}
        isOpen
        toggle={() => {}}
        selectedServer={selectedServer}
      />,
    );

    return wrapper;
  };

  afterEach(() => wrapper?.unmount());
  afterEach(jest.clearAllMocks);

  it('shows an external link to the URL in the header', () => {
    const wrapper = createWrapper();
    const externalLink = wrapper.find(ModalHeader).find(ExternalLink);

    expect(externalLink).toHaveLength(1);
    expect(externalLink.prop('href')).toEqual(shortUrl);
  });

  it.each([
    ['2.5.0' as SemVer, 0, '/qr-code?size=300&format=png'],
    ['2.6.0' as SemVer, 0, '/qr-code?size=300&format=png'],
    ['2.6.0' as SemVer, 10, '/qr-code?size=300&format=png&margin=10'],
    ['2.8.0' as SemVer, 0, '/qr-code?size=300&format=png&errorCorrection=L'],
  ])('displays an image with the QR code of the URL', (version, margin, expectedUrl) => {
    const wrapper = createWrapper(version);
    const formControls = wrapper.find('.form-control-range');

    if (formControls.length > 1) {
      formControls.at(1).simulate('change', { target: { value: `${margin}` } });
    }

    const modalBody = wrapper.find(ModalBody);
    const img = modalBody.find('img');
    const linkInBody = modalBody.find(ExternalLink);
    const copyToClipboard = modalBody.find(CopyToClipboardIcon);

    expect(img.prop('src')).toEqual(`${shortUrl}${expectedUrl}`);
    expect(linkInBody.prop('href')).toEqual(`${shortUrl}${expectedUrl}`);
    expect(copyToClipboard.prop('text')).toEqual(`${shortUrl}${expectedUrl}`);
  });

  it.each([
    [530, 0, 'lg'],
    [200, 0, undefined],
    [830, 0, 'xl'],
    [430, 80, 'lg'],
    [200, 50, undefined],
    [720, 100, 'xl'],
  ])('renders expected size', (size, margin, modalSize) => {
    const wrapper = createWrapper();
    const formControls = wrapper.find('.form-control-range');
    const sizeInput = formControls.at(0);
    const marginInput = formControls.at(1);

    sizeInput.simulate('change', { target: { value: `${size}` } });
    marginInput.simulate('change', { target: { value: `${margin}` } });

    expect(wrapper.find('label').at(0).text()).toEqual(`Size: ${size}px`);
    expect(wrapper.find('label').at(1).text()).toEqual(`Margin: ${margin}px`);
    expect(wrapper.find(Modal).prop('size')).toEqual(modalSize);
  });

  it.each([
    ['2.6.0' as SemVer, 1, 'col-md-4'],
    ['2.8.0' as SemVer, 2, 'col-md-6'],
  ])('shows expected components based on server version', (version, expectedAmountOfDropdowns, expectedRangeClass) => {
    const wrapper = createWrapper(version);
    const dropdownsLength = wrapper.find(QrFormatDropdown).length + wrapper.find(QrErrorCorrectionDropdown).length;
    const firstCol = wrapper.find(Row).find(FormGroup).first();

    expect(dropdownsLength).toEqual(expectedAmountOfDropdowns);
    expect(firstCol.prop('className')).toEqual(`d-grid ${expectedRangeClass}`);
  });

  it('saves the QR code image when clicking the Download button', () => {
    const wrapper = createWrapper();
    const downloadBtn = wrapper.find(Button);

    expect(saveImage).not.toHaveBeenCalled();
    downloadBtn.simulate('click');
    expect(saveImage).toHaveBeenCalledTimes(1);
  });
});
