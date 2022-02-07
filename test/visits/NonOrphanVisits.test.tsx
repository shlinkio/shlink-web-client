import { shallow } from 'enzyme';
import { Mock } from 'ts-mockery';
import { NonOrphanVisits as createNonOrphanVisits } from '../../src/visits/NonOrphanVisits';
import { MercureBoundProps } from '../../src/mercure/helpers/boundToMercureHub';
import { VisitsInfo } from '../../src/visits/types';
import VisitsStats from '../../src/visits/VisitsStats';
import { NonOrphanVisitsHeader } from '../../src/visits/NonOrphanVisitsHeader';
import { Settings } from '../../src/settings/reducers/settings';
import { VisitsExporter } from '../../src/visits/services/VisitsExporter';
import { SelectedServer } from '../../src/servers/data';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn().mockReturnValue(jest.fn()),
  useParams: jest.fn().mockReturnValue({}),
}));

describe('<NonOrphanVisits />', () => {
  it('wraps visits stats and header', () => {
    const getNonOrphanVisits = jest.fn();
    const cancelGetNonOrphanVisits = jest.fn();
    const nonOrphanVisits = Mock.all<VisitsInfo>();
    const NonOrphanVisits = createNonOrphanVisits(Mock.all<VisitsExporter>());

    const wrapper = shallow(
      <NonOrphanVisits
        {...Mock.of<MercureBoundProps>({ mercureInfo: {} })}
        getNonOrphanVisits={getNonOrphanVisits}
        nonOrphanVisits={nonOrphanVisits}
        cancelGetNonOrphanVisits={cancelGetNonOrphanVisits}
        settings={Mock.all<Settings>()}
        selectedServer={Mock.all<SelectedServer>()}
      />,
    ).dive();
    const stats = wrapper.find(VisitsStats);
    const header = wrapper.find(NonOrphanVisitsHeader);

    expect(stats).toHaveLength(1);
    expect(header).toHaveLength(1);
    expect(stats.prop('cancelGetVisits')).toEqual(cancelGetNonOrphanVisits);
    expect(stats.prop('visitsInfo')).toEqual(nonOrphanVisits);
    expect(stats.prop('isOrphanVisits')).not.toBeDefined();
    expect(header.prop('nonOrphanVisits')).toEqual(nonOrphanVisits);
    expect(header.prop('goBack')).toEqual(expect.any(Function));
  });
});
