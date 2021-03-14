import { shallow } from 'enzyme';
import { Mock } from 'ts-mockery';
import { History, Location } from 'history';
import { match } from 'react-router'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { OrphanVisits as createOrphanVisits } from '../../src/visits/OrphanVisits';
import { MercureBoundProps } from '../../src/mercure/helpers/boundToMercureHub';
import { VisitsInfo } from '../../src/visits/types';
import VisitsStats from '../../src/visits/VisitsStats';
import { OrphanVisitsHeader } from '../../src/visits/OrphanVisitsHeader';
import { Settings } from '../../src/settings/reducers/settings';
import { VisitsExporter } from '../../src/visits/services/VisitsExporter';

describe('<OrphanVisits />', () => {
  it('wraps visits stats and header', () => {
    const goBack = jest.fn();
    const getOrphanVisits = jest.fn();
    const cancelGetOrphanVisits = jest.fn();
    const orphanVisits = Mock.all<VisitsInfo>();
    const OrphanVisits = createOrphanVisits(Mock.all<VisitsExporter>());

    const wrapper = shallow(
      <OrphanVisits
        {...Mock.of<MercureBoundProps>({ mercureInfo: {} })}
        getOrphanVisits={getOrphanVisits}
        orphanVisits={orphanVisits}
        cancelGetOrphanVisits={cancelGetOrphanVisits}
        history={Mock.of<History>({ goBack })}
        location={Mock.all<Location>()}
        match={Mock.of<match>({ url: 'the_base_url' })}
        settings={Mock.all<Settings>()}
      />,
    ).dive();
    const stats = wrapper.find(VisitsStats);
    const header = wrapper.find(OrphanVisitsHeader);

    expect(stats).toHaveLength(1);
    expect(header).toHaveLength(1);
    expect(stats.prop('getVisits')).toEqual(getOrphanVisits);
    expect(stats.prop('cancelGetVisits')).toEqual(cancelGetOrphanVisits);
    expect(stats.prop('visitsInfo')).toEqual(orphanVisits);
    expect(stats.prop('baseUrl')).toEqual('the_base_url');
    expect(header.prop('orphanVisits')).toEqual(orphanVisits);
    expect(header.prop('goBack')).toEqual(goBack);
  });
});
