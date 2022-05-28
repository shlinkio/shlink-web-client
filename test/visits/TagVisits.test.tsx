import { shallow, ShallowWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import createTagVisits, { TagVisitsProps } from '../../src/visits/TagVisits';
import TagVisitsHeader from '../../src/visits/TagVisitsHeader';
import ColorGenerator from '../../src/utils/services/ColorGenerator';
import { TagVisits as TagVisitsStats } from '../../src/visits/reducers/tagVisits';
import { VisitsStats } from '../../src/visits/VisitsStats';
import { MercureBoundProps } from '../../src/mercure/helpers/boundToMercureHub';
import { ReportExporter } from '../../src/common/services/ReportExporter';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn().mockReturnValue(jest.fn()),
  useLocation: jest.fn().mockReturnValue({}),
  useParams: jest.fn().mockReturnValue({ tag: 'foo' }),
}));

describe('<TagVisits />', () => {
  let wrapper: ShallowWrapper;
  const getTagVisitsMock = jest.fn();

  beforeEach(() => {
    const TagVisits = createTagVisits(Mock.all<ColorGenerator>(), Mock.all<ReportExporter>());

    wrapper = shallow(
      <TagVisits
        {...Mock.all<TagVisitsProps>()}
        {...Mock.of<MercureBoundProps>({ mercureInfo: {} })}
        getTagVisits={getTagVisitsMock}
        tagVisits={Mock.of<TagVisitsStats>({ loading: true, visits: [] })}
        cancelGetTagVisits={() => {}}
      />,
    ).dive(); // Dive is needed as this component is wrapped in a HOC
  });

  afterEach(() => wrapper.unmount());
  afterEach(jest.resetAllMocks);

  it('renders visit stats and visits header', () => {
    const visitStats = wrapper.find(VisitsStats);
    const visitHeader = wrapper.find(TagVisitsHeader);

    expect(visitStats).toHaveLength(1);
    expect(visitStats.prop('isOrphanVisits')).not.toBeDefined();
    expect(visitHeader).toHaveLength(1);
  });
});
