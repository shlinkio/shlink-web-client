import { shallow, ShallowWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import { History } from 'history';
import { match } from 'react-router'; // eslint-disable-line @typescript-eslint/no-unused-vars
import createTagVisits, { TagVisitsProps } from '../../src/visits/TagVisits';
import TagVisitsHeader from '../../src/visits/TagVisitsHeader';
import ColorGenerator from '../../src/utils/services/ColorGenerator';
import { TagVisits as TagVisitsStats } from '../../src/visits/reducers/tagVisits';
import VisitsStats from '../../src/visits/VisitsStats';
import { MercureBoundProps } from '../../src/mercure/helpers/boundToMercureHub';
import { VisitsExporter } from '../../src/visits/services/VisitsExporter';

describe('<TagVisits />', () => {
  let wrapper: ShallowWrapper;
  const getTagVisitsMock = jest.fn();
  const match = Mock.of<match<{ tag: string }>>({
    params: { tag: 'foo' },
  });
  const history = Mock.of<History>({
    goBack: jest.fn(),
  });

  beforeEach(() => {
    const TagVisits = createTagVisits(Mock.all<ColorGenerator>(), Mock.all<VisitsExporter>());

    wrapper = shallow(
      <TagVisits
        {...Mock.all<TagVisitsProps>()}
        {...Mock.of<MercureBoundProps>({ mercureInfo: {} })}
        getTagVisits={getTagVisitsMock}
        match={match}
        history={history}
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
    expect(visitHeader).toHaveLength(1);
  });
});
