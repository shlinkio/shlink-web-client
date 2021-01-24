import { shallow, ShallowWrapper } from 'enzyme';
import { ExternalLink } from 'react-external-link';
import { Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import { Mock } from 'ts-mockery';
import QrCodeModal from '../../../src/short-urls/helpers/QrCodeModal';
import { ShortUrl } from '../../../src/short-urls/data';
import { ReachableServer } from '../../../src/servers/data';
import { CopyToClipboardIcon } from '../../../src/utils/CopyToClipboardIcon';
import { DropdownBtn } from '../../../src/utils/DropdownBtn';

describe('<QrCodeModal />', () => {
  let wrapper: ShallowWrapper;
  const shortUrl = 'https://doma.in/abc123';
  const createWrapper = (version = '2.5.0') => {
    const selectedServer = Mock.of<ReachableServer>({ version });

    wrapper = shallow(
      <QrCodeModal
        shortUrl={Mock.of<ShortUrl>({ shortUrl })}
        isOpen={true}
        toggle={() => {}}
        selectedServer={selectedServer}
      />,
    );

    return wrapper;
  };

  afterEach(() => wrapper?.unmount());

  it('shows an external link to the URL in the header', () => {
    const wrapper = createWrapper();
    const externalLink = wrapper.find(ModalHeader).find(ExternalLink);

    expect(externalLink).toHaveLength(1);
    expect(externalLink.prop('href')).toEqual(shortUrl);
  });

  it.each([
    [ '2.3.0', '/qr-code/300' ],
    [ '2.4.0', '/qr-code/300?format=png' ],
    [ '2.5.0', '/qr-code?size=300&format=png' ],
  ])('displays an image with the QR code of the URL', (version, expectedUrl) => {
    const wrapper = createWrapper(version);
    const modalBody = wrapper.find(ModalBody);
    const img = modalBody.find('img');
    const linkInBody = modalBody.find(ExternalLink);
    const copyToClipboard = modalBody.find(CopyToClipboardIcon);

    expect(img.prop('src')).toEqual(`${shortUrl}${expectedUrl}`);
    expect(linkInBody.prop('href')).toEqual(`${shortUrl}${expectedUrl}`);
    expect(copyToClipboard.prop('text')).toEqual(`${shortUrl}${expectedUrl}`);
  });

  it.each([
    [ 530, 'lg' ],
    [ 200, undefined ],
    [ 830, 'xl' ],
  ])('renders expected size', (size, modalSize) => {
    const wrapper = createWrapper();
    const sizeInput = wrapper.find('.form-control-range');

    sizeInput.simulate('change', { target: { value: `${size}` } });

    expect(wrapper.find('.mt-2').text()).toEqual(`${size}x${size}`);
    expect(wrapper.find('label').text()).toEqual(`Size: ${size}px`);
    expect(wrapper.find(Modal).prop('size')).toEqual(modalSize);
  });

  it.each([
    [ '2.3.0', 0, 'col-12' ],
    [ '2.4.0', 1, 'col-md-6' ],
  ])('shows expected components based on server version', (version, expectedAmountOfDropdowns, expectedRangeClass) => {
    const wrapper = createWrapper(version);
    const dropdown = wrapper.find(DropdownBtn);
    const firstCol = wrapper.find(Row).find('div').first();

    expect(dropdown).toHaveLength(expectedAmountOfDropdowns);
    expect(firstCol.prop('className')).toEqual(expectedRangeClass);
  });
});
