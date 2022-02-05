import { shallow, ShallowWrapper } from 'enzyme';
import { identity } from 'ramda';
import { Mock } from 'ts-mockery';
import { History, Location } from 'history';
import { match } from 'react-router'; // eslint-disable-line @typescript-eslint/no-unused-vars
import createShortUrlVisits, { ShortUrlVisitsProps } from '../../src/visits/ShortUrlVisits';
import ShortUrlVisitsHeader from '../../src/visits/ShortUrlVisitsHeader';
import { ShortUrlVisits as ShortUrlVisitsState } from '../../src/visits/reducers/shortUrlVisits';
import { ShortUrlDetail } from '../../src/short-urls/reducers/shortUrlDetail';
import VisitsStats from '../../src/visits/VisitsStats';
import { MercureBoundProps } from '../../src/mercure/helpers/boundToMercureHub';
import { VisitsExporter } from '../../src/visits/services/VisitsExporter';

describe('<ShortUrlVisits />', () => {
  let wrapper: ShallowWrapper;
  const getShortUrlVisitsMock = jest.fn();
  const match = Mock.of<match<{ shortCode: string }>>({
    params: { shortCode: 'abc123' },
  });
  const location = Mock.of<Location>({ search: '' });
  const history = Mock.of<History>({
    goBack: jest.fn(),
  });
  const ShortUrlVisits = createShortUrlVisits(Mock.all<VisitsExporter>());

  beforeEach(() => {
    wrapper = shallow(
      <ShortUrlVisits
        {...Mock.all<ShortUrlVisitsProps>()}
        {...Mock.of<MercureBoundProps>({ mercureInfo: {} })}
        getShortUrlDetail={identity}
        getShortUrlVisits={getShortUrlVisitsMock}
        match={match}
        location={location}
        history={history}
        shortUrlVisits={Mock.of<ShortUrlVisitsState>({ loading: true, visits: [] })}
        shortUrlDetail={Mock.all<ShortUrlDetail>()}
        cancelGetShortUrlVisits={() => {}}
      />,
    ).dive(); // Dive is needed as this component is wrapped in a HOC
  });

  afterEach(() => wrapper.unmount());
  afterEach(jest.resetAllMocks);

  it('renders visit stats and visits header', () => {
    const visitStats = wrapper.find(VisitsStats);
    const visitHeader = wrapper.find(ShortUrlVisitsHeader);

    expect(visitStats).toHaveLength(1);
    expect(visitStats.prop('isOrphanVisits')).not.toBeDefined();
    expect(visitHeader).toHaveLength(1);
  });
});
