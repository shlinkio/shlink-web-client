import { shallow, ShallowWrapper } from 'enzyme';
import { identity } from 'ramda';
import { Mock } from 'ts-mockery';
import createShortUrlVisits, { ShortUrlVisitsProps } from '../../src/visits/ShortUrlVisits';
import ShortUrlVisitsHeader from '../../src/visits/ShortUrlVisitsHeader';
import { ShortUrlVisits as ShortUrlVisitsState } from '../../src/visits/reducers/shortUrlVisits';
import { ShortUrlDetail } from '../../src/short-urls/reducers/shortUrlDetail';
import { VisitsStats } from '../../src/visits/VisitsStats';
import { MercureBoundProps } from '../../src/mercure/helpers/boundToMercureHub';
import { ReportExporter } from '../../src/common/services/ReportExporter';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn().mockReturnValue(jest.fn()),
  useLocation: jest.fn().mockReturnValue({ search: '' }),
  useParams: jest.fn().mockReturnValue({ shortCode: 'abc123' }),
}));

describe('<ShortUrlVisits />', () => {
  let wrapper: ShallowWrapper;
  const getShortUrlVisitsMock = jest.fn();
  const ShortUrlVisits = createShortUrlVisits(Mock.all<ReportExporter>());

  beforeEach(() => {
    wrapper = shallow(
      <ShortUrlVisits
        {...Mock.all<ShortUrlVisitsProps>()}
        {...Mock.of<MercureBoundProps>({ mercureInfo: {} })}
        getShortUrlDetail={identity}
        getShortUrlVisits={getShortUrlVisitsMock}
        shortUrlVisits={Mock.of<ShortUrlVisitsState>({ loading: true, visits: [] })}
        shortUrlDetail={Mock.all<ShortUrlDetail>()}
        cancelGetShortUrlVisits={() => {}}
      />,
    ).dive(); // Dive is needed as this component is wrapped in a HOC
  });

  afterEach(jest.clearAllMocks);
  afterEach(() => wrapper.unmount());

  it('renders visit stats and visits header', () => {
    const visitStats = wrapper.find(VisitsStats);
    const visitHeader = wrapper.find(ShortUrlVisitsHeader);

    expect(visitStats).toHaveLength(1);
    expect(visitStats.prop('isOrphanVisits')).not.toBeDefined();
    expect(visitHeader).toHaveLength(1);
  });
});
