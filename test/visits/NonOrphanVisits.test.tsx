import { shallow } from 'enzyme';
import { Mock } from 'ts-mockery';
import { History, Location } from 'history';
import { match } from 'react-router';
import { NonOrphanVisits as createNonOrphanVisits } from '../../src/visits/NonOrphanVisits';
import { MercureBoundProps } from '../../src/mercure/helpers/boundToMercureHub';
import { VisitsInfo } from '../../src/visits/types';
import VisitsStats from '../../src/visits/VisitsStats';
import { NonOrphanVisitsHeader } from '../../src/visits/NonOrphanVisitsHeader';
import { Settings } from '../../src/settings/reducers/settings';
import { VisitsExporter } from '../../src/visits/services/VisitsExporter';
import { SelectedServer } from '../../src/servers/data';

describe('<NonOrphanVisits />', () => {
  it('wraps visits stats and header', () => {
    const goBack = jest.fn();
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
        history={Mock.of<History>({ goBack })}
        location={Mock.all<Location>()}
        match={Mock.of<match>({ url: 'the_base_url' })}
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
    expect(stats.prop('baseUrl')).toEqual('the_base_url');
    expect(stats.prop('isOrphanVisits')).not.toBeDefined();
    expect(header.prop('nonOrphanVisits')).toEqual(nonOrphanVisits);
    expect(header.prop('goBack')).toEqual(goBack);
  });
});
