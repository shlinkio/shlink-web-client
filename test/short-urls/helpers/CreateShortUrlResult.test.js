import React from 'react';
import { shallow } from 'enzyme';
import { identity } from 'ramda';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Tooltip } from 'reactstrap';
import CreateShortUrlResult from '../../../src/short-urls/helpers/CreateShortUrlResult';

describe('<CreateShortUrlResult />', () => {
  let wrapper;
  const createWrapper = (result, error = false) => {
    wrapper = shallow(<CreateShortUrlResult resetCreateShortUrl={identity} result={result} error={error} />);

    return wrapper;
  };

  afterEach(() => wrapper && wrapper.unmount());

  it('renders an error when error is true', () => {
    const wrapper = createWrapper({}, true);
    const errorCard = wrapper.find('.bg-danger');

    expect(errorCard).toHaveLength(1);
    expect(errorCard.html()).toContain('An error occurred while creating the URL :(');
  });

  it('renders nothing when no result is provided', () => {
    const wrapper = createWrapper();

    expect(wrapper.html()).toBeNull();
  });

  it('renders a result message when result is provided', () => {
    const wrapper = createWrapper({ shortUrl: 'https://doma.in/abc123' });

    expect(wrapper.html()).toContain('<b>Great!</b> The short URL is <b>https://doma.in/abc123</b>');
    expect(wrapper.find(CopyToClipboard)).toHaveLength(1);
    expect(wrapper.find(Tooltip)).toHaveLength(1);
  });

  it('Shows tooltip when copy to clipboard button is clicked', () => {
    const wrapper = createWrapper({ shortUrl: 'https://doma.in/abc123' });
    const copyBtn = wrapper.find(CopyToClipboard);

    expect(wrapper.state('showCopyTooltip')).toEqual(false);
    copyBtn.simulate('copy');
    expect(wrapper.state('showCopyTooltip')).toEqual(true);
  });
});
