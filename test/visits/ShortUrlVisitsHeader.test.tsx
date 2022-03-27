import { shallow, ShallowWrapper } from 'enzyme';
import { ExternalLink } from 'react-external-link';
import { Mock } from 'ts-mockery';
import ShortUrlVisitsHeader from '../../src/visits/ShortUrlVisitsHeader';
import { ShortUrlDetail } from '../../src/short-urls/reducers/shortUrlDetail';
import { ShortUrlVisits } from '../../src/visits/reducers/shortUrlVisits';
import { Time } from '../../src/utils/Time';

describe('<ShortUrlVisitsHeader />', () => {
  let wrapper: ShallowWrapper;
  const dateCreated = '2018-01-01T10:00:00+01:00';
  const longUrl = 'https://foo.bar/bar/foo';
  const shortUrlVisits = Mock.of<ShortUrlVisits>({
    visits: [{}, {}, {}],
  });
  const goBack = jest.fn();
  const createWrapper = (title?: string | null) => {
    const shortUrlDetail = Mock.of<ShortUrlDetail>({
      shortUrl: {
        shortUrl: 'https://doma.in/abc123',
        longUrl,
        dateCreated,
        title,
      },
      loading: false,
    });

    wrapper = shallow(
      <ShortUrlVisitsHeader shortUrlDetail={shortUrlDetail} shortUrlVisits={shortUrlVisits} goBack={goBack} />,
    );

    return wrapper;
  };

  beforeEach(() => createWrapper());
  afterEach(() => wrapper.unmount());

  it('shows when the URL was created', () => {
    const time = wrapper.find(Time).first();

    expect(time.prop('date')).toEqual(dateCreated);
  });

  it.each([
    [null, longUrl],
    [undefined, longUrl],
    ['My cool title', 'My cool title'],
  ])('shows the long URL and title', (title, expectedContent) => {
    const wrapper = createWrapper(title);
    const longUrlLink = wrapper.find(ExternalLink).last();

    expect(longUrlLink.prop('href')).toEqual(longUrl);
    expect(longUrlLink.prop('children')).toEqual(expectedContent);
  });
});
