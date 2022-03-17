import { shallow } from 'enzyme';
import { Mock } from 'ts-mockery';
import { OrphanVisits as createOrphanVisits } from '../../src/visits/OrphanVisits';
import { MercureBoundProps } from '../../src/mercure/helpers/boundToMercureHub';
import { VisitsInfo } from '../../src/visits/types';
import VisitsStats from '../../src/visits/VisitsStats';
import { OrphanVisitsHeader } from '../../src/visits/OrphanVisitsHeader';
import { Settings } from '../../src/settings/reducers/settings';
import { ReportExporter } from '../../src/common/services/ReportExporter';
import { SelectedServer } from '../../src/servers/data';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn().mockReturnValue(jest.fn()),
  useParams: jest.fn().mockReturnValue({}),
}));

describe('<OrphanVisits />', () => {
  it('wraps visits stats and header', () => {
    const getOrphanVisits = jest.fn();
    const cancelGetOrphanVisits = jest.fn();
    const orphanVisits = Mock.all<VisitsInfo>();
    const OrphanVisits = createOrphanVisits(Mock.all<ReportExporter>());

    const wrapper = shallow(
      <OrphanVisits
        {...Mock.of<MercureBoundProps>({ mercureInfo: {} })}
        getOrphanVisits={getOrphanVisits}
        orphanVisits={orphanVisits}
        cancelGetOrphanVisits={cancelGetOrphanVisits}
        settings={Mock.all<Settings>()}
        selectedServer={Mock.all<SelectedServer>()}
      />,
    ).dive();
    const stats = wrapper.find(VisitsStats);
    const header = wrapper.find(OrphanVisitsHeader);

    expect(stats).toHaveLength(1);
    expect(header).toHaveLength(1);
    expect(stats.prop('cancelGetVisits')).toEqual(cancelGetOrphanVisits);
    expect(stats.prop('visitsInfo')).toEqual(orphanVisits);
    expect(stats.prop('isOrphanVisits')).toEqual(true);
    expect(header.prop('orphanVisits')).toEqual(orphanVisits);
    expect(header.prop('goBack')).toEqual(expect.any(Function));
  });
});
