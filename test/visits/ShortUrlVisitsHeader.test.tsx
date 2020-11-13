import { shallow, ShallowWrapper } from 'enzyme';
import Moment from 'react-moment';
import { ExternalLink } from 'react-external-link';
import { Mock } from 'ts-mockery';
import ShortUrlVisitsHeader from '../../src/visits/ShortUrlVisitsHeader';
import { ShortUrlDetail } from '../../src/visits/reducers/shortUrlDetail';
import { ShortUrlVisits } from '../../src/visits/reducers/shortUrlVisits';

describe('<ShortUrlVisitsHeader />', () => {
  let wrapper: ShallowWrapper;
  const shortUrlDetail = Mock.of<ShortUrlDetail>({
    shortUrl: {
      shortUrl: 'https://doma.in/abc123',
      longUrl: 'https://foo.bar/bar/foo',
      dateCreated: '2018-01-01T10:00:00+01:00',
    },
    loading: false,
  });
  const shortUrlVisits = Mock.of<ShortUrlVisits>({
    visits: [{}, {}, {}],
  });
  const goBack = jest.fn();

  beforeEach(() => {
    wrapper = shallow(
      <ShortUrlVisitsHeader shortUrlDetail={shortUrlDetail} shortUrlVisits={shortUrlVisits} goBack={goBack} />,
    );
  });
  afterEach(() => wrapper.unmount());

  it('shows when the URL was created', () => {
    const moment = wrapper.find(Moment).first();

    expect(moment.prop('children')).toEqual(shortUrlDetail.shortUrl?.dateCreated);
  });

  it('shows the long URL', () => {
    const longUrlLink = wrapper.find(ExternalLink).last();

    expect(longUrlLink.prop('href')).toEqual(shortUrlDetail.shortUrl?.longUrl);
  });
});
