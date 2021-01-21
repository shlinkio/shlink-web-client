import { shallow, ShallowWrapper } from 'enzyme';
import { ExternalLink } from 'react-external-link';
import { ModalHeader } from 'reactstrap';
import { Mock } from 'ts-mockery';
import QrCodeModal from '../../../src/short-urls/helpers/QrCodeModal';
import { ShortUrl } from '../../../src/short-urls/data';
import { ReachableServer } from '../../../src/servers/data';

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

  it('displays an image with the QR code of the URL', () => {
    const wrapper = createWrapper();
    const img = wrapper.find('img');

    expect(img).toHaveLength(1);
    expect(img.prop('src')).toEqual(`${shortUrl}/qr-code`);
  });
});
