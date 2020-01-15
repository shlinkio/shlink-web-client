import React from 'react';
import { shallow } from 'enzyme';
import { ExternalLink } from 'react-external-link';
import PreviewModal from '../../../src/short-urls/helpers/PreviewModal';

describe('<PreviewModal />', () => {
  let wrapper;
  const url = 'https://doma.in/abc123';

  beforeEach(() => {
    wrapper = shallow(<PreviewModal url={url} />);
  });
  afterEach(() => wrapper.unmount());

  it('shows an external link to the URL', () => {
    const externalLink = wrapper.find(ExternalLink);

    expect(externalLink).toHaveLength(1);
    expect(externalLink.prop('href')).toEqual(url);
  });

  it('displays an image with the preview of the URL', () => {
    const img = wrapper.find('img');

    expect(img).toHaveLength(1);
    expect(img.prop('src')).toEqual(`${url}/preview`);
  });
});
