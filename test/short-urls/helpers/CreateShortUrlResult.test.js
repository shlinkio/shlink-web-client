import React from 'react';
import { shallow } from 'enzyme';
import { identity } from 'ramda';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Tooltip } from 'reactstrap';
import createCreateShortUrlResult from '../../../src/short-urls/helpers/CreateShortUrlResult';

describe('<CreateShortUrlResult />', () => {
  let wrapper;
  const copyToClipboard = jest.fn();
  const useStateFlagTimeout = jest.fn(() => [ false, copyToClipboard ]);
  const CreateShortUrlResult = createCreateShortUrlResult(useStateFlagTimeout);
  const createWrapper = (result, error = false) => {
    wrapper = shallow(<CreateShortUrlResult resetCreateShortUrl={identity} result={result} error={error} />);

    return wrapper;
  };

  afterEach(() => {
    jest.clearAllMocks();
    wrapper && wrapper.unmount();
  });

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

  it('Invokes tooltip timeout when copy to clipboard button is clicked', () => {
    const wrapper = createWrapper({ shortUrl: 'https://doma.in/abc123' });
    const copyBtn = wrapper.find(CopyToClipboard);

    expect(copyToClipboard).not.toHaveBeenCalled();
    copyBtn.simulate('copy');
    expect(copyToClipboard).toHaveBeenCalledTimes(1);
  });
});
