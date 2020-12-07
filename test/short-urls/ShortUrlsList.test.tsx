import { shallow, ShallowWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import shortUrlsListCreator, { ShortUrlsListProps } from '../../src/short-urls/ShortUrlsList';
import { ShortUrl } from '../../src/short-urls/data';
import { MercureBoundProps } from '../../src/mercure/helpers/boundToMercureHub';
import { ShortUrlsList as ShortUrlsListModel } from '../../src/short-urls/reducers/shortUrlsList';
import SortingDropdown from '../../src/utils/SortingDropdown';

describe('<ShortUrlsList />', () => {
  let wrapper: ShallowWrapper;
  const ShortUrlsTable = () => null;
  const listShortUrlsMock = jest.fn();
  const resetShortUrlParamsMock = jest.fn();
  const shortUrlsList = Mock.of<ShortUrlsListModel>({
    shortUrls: {
      data: [
        Mock.of<ShortUrl>({
          shortCode: 'testShortCode',
          shortUrl: 'https://www.example.com/testShortUrl',
          longUrl: 'https://www.example.com/testLongUrl',
          tags: [ 'test tag' ],
        }),
      ],
    },
  });

  const ShortUrlsList = shortUrlsListCreator(ShortUrlsTable);

  beforeEach(() => {
    wrapper = shallow(
      <ShortUrlsList
        {...Mock.all<ShortUrlsListProps>()}
        {...Mock.of<MercureBoundProps>({ mercureInfo: { loading: true } })}
        listShortUrls={listShortUrlsMock}
        resetShortUrlParams={resetShortUrlParamsMock}
        shortUrlsListParams={{
          page: '1',
          tags: [ 'test tag' ],
          searchTerm: 'example.com',
        }}
        match={{ params: {} } as any}
        location={{} as any}
        shortUrlsList={shortUrlsList}
      />,
    ).dive(); // Dive is needed as this component is wrapped in a HOC
  });

  afterEach(jest.resetAllMocks);
  afterEach(() => wrapper?.unmount());

  it('wraps a ShortUrlsTable', () => {
    expect(wrapper.find(ShortUrlsTable)).toHaveLength(1);
  });

  it('wraps a SortingDropdown', () => {
    expect(wrapper.find(SortingDropdown)).toHaveLength(1);
  });
});
