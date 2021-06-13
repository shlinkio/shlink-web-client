import Bottle from 'bottlejs';
import ShortUrlVisits from '../ShortUrlVisits';
import { cancelGetShortUrlVisits, getShortUrlVisits } from '../reducers/shortUrlVisits';
import MapModal from '../helpers/MapModal';
import { createNewVisits } from '../reducers/visitCreation';
import TagVisits from '../TagVisits';
import { cancelGetTagVisits, getTagVisits } from '../reducers/tagVisits';
import { OrphanVisits } from '../OrphanVisits';
import { cancelGetOrphanVisits, getOrphanVisits } from '../reducers/orphanVisits';
import { ConnectDecorator } from '../../container/types';
import { loadVisitsOverview } from '../reducers/visitsOverview';
import * as visitsParser from './VisitsParser';
import { VisitsExporter } from './VisitsExporter';

const provideServices = (bottle: Bottle, connect: ConnectDecorator) => {
  // Components
  bottle.serviceFactory('MapModal', () => MapModal);

  bottle.serviceFactory('ShortUrlVisits', ShortUrlVisits, 'VisitsExporter');
  bottle.decorator('ShortUrlVisits', connect(
    [ 'shortUrlVisits', 'shortUrlDetail', 'mercureInfo', 'settings', 'selectedServer' ],
    [ 'getShortUrlVisits', 'getShortUrlDetail', 'cancelGetShortUrlVisits', 'createNewVisits', 'loadMercureInfo' ],
  ));

  bottle.serviceFactory('TagVisits', TagVisits, 'ColorGenerator', 'VisitsExporter');
  bottle.decorator('TagVisits', connect(
    [ 'tagVisits', 'mercureInfo', 'settings', 'selectedServer' ],
    [ 'getTagVisits', 'cancelGetTagVisits', 'createNewVisits', 'loadMercureInfo' ],
  ));

  bottle.serviceFactory('OrphanVisits', OrphanVisits, 'VisitsExporter');
  bottle.decorator('OrphanVisits', connect(
    [ 'orphanVisits', 'mercureInfo', 'settings', 'selectedServer' ],
    [ 'getOrphanVisits', 'cancelGetOrphanVisits', 'createNewVisits', 'loadMercureInfo' ],
  ));

  // Services
  bottle.serviceFactory('VisitsParser', () => visitsParser);
  bottle.service('VisitsExporter', VisitsExporter, 'window', 'csvjson');

  // Actions
  bottle.serviceFactory('getShortUrlVisits', getShortUrlVisits, 'buildShlinkApiClient');
  bottle.serviceFactory('cancelGetShortUrlVisits', () => cancelGetShortUrlVisits);

  bottle.serviceFactory('getTagVisits', getTagVisits, 'buildShlinkApiClient');
  bottle.serviceFactory('cancelGetTagVisits', () => cancelGetTagVisits);

  bottle.serviceFactory('getOrphanVisits', getOrphanVisits, 'buildShlinkApiClient');
  bottle.serviceFactory('cancelGetOrphanVisits', () => cancelGetOrphanVisits);

  bottle.serviceFactory('createNewVisits', () => createNewVisits);
  bottle.serviceFactory('loadVisitsOverview', loadVisitsOverview, 'buildShlinkApiClient');
};

export default provideServices;
