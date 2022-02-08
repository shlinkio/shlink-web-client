import { shallow, ShallowWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import { useLocation, useParams } from 'react-router-dom';
import { EditShortUrl as createEditShortUrl } from '../../src/short-urls/EditShortUrl';
import { Settings } from '../../src/settings/reducers/settings';
import { ShortUrlDetail } from '../../src/short-urls/reducers/shortUrlDetail';
import { ShortUrlEdition } from '../../src/short-urls/reducers/shortUrlEdition';
import { ShlinkApiError } from '../../src/api/ShlinkApiError';
import { ShortUrl } from '../../src/short-urls/data';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn().mockReturnValue(jest.fn()),
  useParams: jest.fn().mockReturnValue({}),
  useLocation: jest.fn().mockReturnValue({}),
}));

describe('<EditShortUrl />', () => {
  let wrapper: ShallowWrapper;
  const ShortUrlForm = () => null;
  const getShortUrlDetail = jest.fn();
  const editShortUrl = jest.fn(async () => Promise.resolve());
  const shortUrlCreation = { validateUrls: true };
  const EditShortUrl = createEditShortUrl(ShortUrlForm);
  const createWrapper = (detail: Partial<ShortUrlDetail> = {}, edition: Partial<ShortUrlEdition> = {}) => {
    (useParams as any).mockReturnValue({ shortCode: 'the_base_url' });
    (useLocation as any).mockReturnValue({ search: '' });

    wrapper = shallow(
      <EditShortUrl
        settings={Mock.of<Settings>({ shortUrlCreation })}
        selectedServer={null}
        shortUrlDetail={Mock.of<ShortUrlDetail>(detail)}
        shortUrlEdition={Mock.of<ShortUrlEdition>(edition)}
        getShortUrlDetail={getShortUrlDetail}
        editShortUrl={editShortUrl}
      />,
    );

    return wrapper;
  };

  beforeEach(jest.clearAllMocks);
  afterEach(() => wrapper?.unmount());

  it('renders loading message while loading detail', () => {
    const wrapper = createWrapper({ loading: true });

    expect(wrapper.prop('loading')).toEqual(true);
  });

  it('renders error when loading detail fails', () => {
    const wrapper = createWrapper({ error: true });
    const form = wrapper.find(ShortUrlForm);
    const apiError = wrapper.find(ShlinkApiError);

    expect(form).toHaveLength(0);
    expect(apiError).toHaveLength(1);
    expect(apiError.prop('fallbackMessage')).toEqual('An error occurred while loading short URL detail :(');
  });

  it.each([
    [ undefined, { longUrl: '', validateUrl: true }, true ],
    [
      Mock.of<ShortUrl>({ meta: {} }),
      {
        longUrl: undefined,
        tags: undefined,
        title: undefined,
        domain: undefined,
        validSince: undefined,
        validUntil: undefined,
        maxVisits: undefined,
        validateUrl: true,
      },
      false,
    ],
  ])('renders form when detail properly loads', (shortUrl, expectedInitialState, saving) => {
    const wrapper = createWrapper({ shortUrl }, { saving });
    const form = wrapper.find(ShortUrlForm);
    const apiError = wrapper.find(ShlinkApiError);

    expect(form).toHaveLength(1);
    expect(apiError).toHaveLength(0);
    expect(form.prop('initialState')).toEqual(expectedInitialState);
    expect(form.prop('saving')).toEqual(saving);
    expect(editShortUrl).not.toHaveBeenCalled();

    form.simulate('save', {});

    if (shortUrl) {
      expect(editShortUrl).toHaveBeenCalledWith(shortUrl.shortCode, shortUrl.domain, {});
    } else {
      expect(editShortUrl).not.toHaveBeenCalled();
    }
  });

  it('shows error when saving data has failed', () => {
    const wrapper = createWrapper({}, { error: true });
    const form = wrapper.find(ShortUrlForm);
    const apiError = wrapper.find(ShlinkApiError);

    expect(form).toHaveLength(1);
    expect(apiError).toHaveLength(1);
    expect(apiError.prop('fallbackMessage')).toEqual('An error occurred while updating short URL :(');
  });
});
