import { shallow, ShallowWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import createShortUrlsCreator from '../../src/short-urls/CreateShortUrl';
import { ShortUrlCreation } from '../../src/short-urls/reducers/shortUrlCreation';
import { Settings } from '../../src/settings/reducers/settings';

describe('<CreateShortUrl />', () => {
  let wrapper: ShallowWrapper;
  const ShortUrlForm = () => null;
  const CreateShortUrlResult = () => null;
  const shortUrlCreation = { validateUrls: true };
  const shortUrlCreationResult = Mock.all<ShortUrlCreation>();
  const createShortUrl = jest.fn(async () => Promise.resolve());

  beforeEach(() => {
    const CreateShortUrl = createShortUrlsCreator(ShortUrlForm, CreateShortUrlResult);

    wrapper = shallow(
      <CreateShortUrl
        shortUrlCreationResult={shortUrlCreationResult}
        createShortUrl={createShortUrl}
        selectedServer={null}
        resetCreateShortUrl={() => {}}
        settings={Mock.of<Settings>({ shortUrlCreation })}
      />,
    );
  });
  afterEach(() => wrapper.unmount());
  afterEach(jest.clearAllMocks);

  it('renders a ShortUrlForm with a computed initial state', () => {
    const form = wrapper.find(ShortUrlForm);
    const result = wrapper.find(CreateShortUrlResult);

    expect(form).toHaveLength(1);
    expect(result).toHaveLength(1);
  });
});
