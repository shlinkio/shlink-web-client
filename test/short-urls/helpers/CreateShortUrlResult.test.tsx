import { shallow, ShallowWrapper } from 'enzyme';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Tooltip } from 'reactstrap';
import { Mock } from 'ts-mockery';
import createCreateShortUrlResult from '../../../src/short-urls/helpers/CreateShortUrlResult';
import { ShortUrl } from '../../../src/short-urls/data';
import { StateFlagTimeout } from '../../../src/utils/helpers/hooks';
import { Result } from '../../../src/utils/Result';

describe('<CreateShortUrlResult />', () => {
  let wrapper: ShallowWrapper;
  const copyToClipboard = jest.fn();
  const useStateFlagTimeout = jest.fn(() => [false, copyToClipboard]) as StateFlagTimeout;
  const CreateShortUrlResult = createCreateShortUrlResult(useStateFlagTimeout);
  const createWrapper = (result: ShortUrl | null = null, error = false) => {
    wrapper = shallow(
      <CreateShortUrlResult resetCreateShortUrl={() => {}} result={result} error={error} saving={false} />,
    );

    return wrapper;
  };

  afterEach(jest.clearAllMocks);
  afterEach(() => wrapper?.unmount());

  it('renders an error when error is true', () => {
    const wrapper = createWrapper(Mock.all<ShortUrl>(), true);
    const errorCard = wrapper.find(Result).filterWhere((result) => result.prop('type') === 'error');

    expect(errorCard).toHaveLength(1);
    expect(errorCard.html()).toContain('An error occurred while creating the URL :(');
  });

  it('renders nothing when no result is provided', () => {
    const wrapper = createWrapper();

    expect(wrapper.html()).toBeNull();
  });

  it('renders a result message when result is provided', () => {
    const wrapper = createWrapper(Mock.of<ShortUrl>({ shortUrl: 'https://doma.in/abc123' }));

    expect(wrapper.html()).toContain('<b>Great!</b> The short URL is <b>https://doma.in/abc123</b>');
    expect(wrapper.find(CopyToClipboard)).toHaveLength(1);
    expect(wrapper.find(Tooltip)).toHaveLength(1);
  });

  it('Invokes tooltip timeout when copy to clipboard button is clicked', () => {
    const wrapper = createWrapper(Mock.of<ShortUrl>({ shortUrl: 'https://doma.in/abc123' }));
    const copyBtn = wrapper.find(CopyToClipboard);

    expect(copyToClipboard).not.toHaveBeenCalled();
    copyBtn.simulate('copy');
    expect(copyToClipboard).toHaveBeenCalledTimes(1);
  });
});
