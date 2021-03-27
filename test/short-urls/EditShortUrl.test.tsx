import { shallow, ShallowWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import { History, Location } from 'history';
import { match } from 'react-router'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { EditShortUrl as createEditShortUrl } from '../../src/short-urls/EditShortUrl';
import { Settings } from '../../src/settings/reducers/settings';
import { ShortUrlDetail } from '../../src/short-urls/reducers/shortUrlDetail';
import { ShortUrlEdition } from '../../src/short-urls/reducers/shortUrlEdition';
import { ShlinkApiError } from '../../src/api/ShlinkApiError';
import { ShortUrl } from '../../src/short-urls/data';

describe('<EditShortUrl />', () => {
  let wrapper: ShallowWrapper;
  const ShortUrlForm = () => null;
  const goBack = jest.fn();
  const getShortUrlDetail = jest.fn();
  const editShortUrl = jest.fn();
  const shortUrlCreation = { validateUrls: true };
  const createWrapper = (detail: Partial<ShortUrlDetail> = {}, edition: Partial<ShortUrlEdition> = {}) => {
    const EditSHortUrl = createEditShortUrl(ShortUrlForm);

    wrapper = shallow(
      <EditSHortUrl
        settings={Mock.of<Settings>({ shortUrlCreation })}
        selectedServer={null}
        shortUrlDetail={Mock.of<ShortUrlDetail>(detail)}
        shortUrlEdition={Mock.of<ShortUrlEdition>(edition)}
        getShortUrlDetail={getShortUrlDetail}
        editShortUrl={editShortUrl}
        history={Mock.of<History>({ goBack })}
        location={Mock.all<Location>()}
        match={Mock.of<match<{ shortCode: string }>>({
          params: { shortCode: 'the_base_url' },
        })}
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
