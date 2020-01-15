import React from 'react';
import { shallow } from 'enzyme';
import { ExternalLink } from 'react-external-link';
import QrCodeModal from '../../../src/short-urls/helpers/QrCodeModal';

describe('<QrCodeModal />', () => {
  let wrapper;
  const url = 'https://doma.in/abc123';

  beforeEach(() => {
    wrapper = shallow(<QrCodeModal url={url} />);
  });
  afterEach(() => wrapper.unmount());

  it('shows an external link to the URL', () => {
    const externalLink = wrapper.find(ExternalLink);

    expect(externalLink).toHaveLength(1);
    expect(externalLink.prop('href')).toEqual(url);
  });

  it('displays an image with the QR code of the URL', () => {
    const img = wrapper.find('img');

    expect(img).toHaveLength(1);
    expect(img.prop('src')).toEqual(`${url}/qr-code`);
  });
});
