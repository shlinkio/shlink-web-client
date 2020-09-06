import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { ExternalLink } from 'react-external-link';
import { Mock } from 'ts-mockery';
import QrCodeModal from '../../../src/short-urls/helpers/QrCodeModal';
import { ShortUrl } from '../../../src/short-urls/data';

describe('<QrCodeModal />', () => {
  let wrapper: ShallowWrapper;
  const shortUrl = 'https://doma.in/abc123';

  beforeEach(() => {
    wrapper = shallow(<QrCodeModal shortUrl={Mock.of<ShortUrl>({ shortUrl })} isOpen={true} toggle={() => {}} />);
  });
  afterEach(() => wrapper.unmount());

  it('shows an external link to the URL', () => {
    const externalLink = wrapper.find(ExternalLink);

    expect(externalLink).toHaveLength(1);
    expect(externalLink.prop('href')).toEqual(shortUrl);
  });

  it('displays an image with the QR code of the URL', () => {
    const img = wrapper.find('img');

    expect(img).toHaveLength(1);
    expect(img.prop('src')).toEqual(`${shortUrl}/qr-code`);
  });
});
