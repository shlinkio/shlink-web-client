import Bottle from 'bottlejs';
import ShortUrlVisits from '../ShortUrlVisits';
import { cancelGetShortUrlVisits, getShortUrlVisits } from '../reducers/shortUrlVisits';
import { getShortUrlDetail } from '../../short-urls/reducers/shortUrlDetail';
import MapModal from '../helpers/MapModal';
import { createNewVisits } from '../reducers/visitCreation';
import TagVisits from '../TagVisits';
import { cancelGetTagVisits, getTagVisits } from '../reducers/tagVisits';
import { OrphanVisits } from '../OrphanVisits';
import { cancelGetOrphanVisits, getOrphanVisits } from '../reducers/orphanVisits';
import { ConnectDecorator } from '../../container/types';
import { loadVisitsOverview } from '../reducers/visitsOverview';
import * as visitsParser from './VisitsParser';

const provideServices = (bottle: Bottle, connect: ConnectDecorator) => {
  // Components
  bottle.serviceFactory('MapModal', () => MapModal);

  bottle.serviceFactory('ShortUrlVisits', () => ShortUrlVisits);
  bottle.decorator('ShortUrlVisits', connect(
    [ 'shortUrlVisits', 'shortUrlDetail', 'mercureInfo', 'settings' ],
    [ 'getShortUrlVisits', 'getShortUrlDetail', 'cancelGetShortUrlVisits', 'createNewVisits', 'loadMercureInfo' ],
  ));

  bottle.serviceFactory('TagVisits', TagVisits, 'ColorGenerator');
  bottle.decorator('TagVisits', connect(
    [ 'tagVisits', 'mercureInfo', 'settings' ],
    [ 'getTagVisits', 'cancelGetTagVisits', 'createNewVisits', 'loadMercureInfo' ],
  ));

  bottle.serviceFactory('OrphanVisits', () => OrphanVisits);
  bottle.decorator('OrphanVisits', connect(
    [ 'orphanVisits', 'mercureInfo', 'settings' ],
    [ 'getOrphanVisits', 'cancelGetOrphanVisits', 'createNewVisits', 'loadMercureInfo' ],
  ));

  // Services
  bottle.serviceFactory('VisitsParser', () => visitsParser);

  // Actions
  bottle.serviceFactory('getShortUrlVisits', getShortUrlVisits, 'buildShlinkApiClient');
  bottle.serviceFactory('getShortUrlDetail', getShortUrlDetail, 'buildShlinkApiClient');
  bottle.serviceFactory('cancelGetShortUrlVisits', () => cancelGetShortUrlVisits);

  bottle.serviceFactory('getTagVisits', getTagVisits, 'buildShlinkApiClient');
  bottle.serviceFactory('cancelGetTagVisits', () => cancelGetTagVisits);

  bottle.serviceFactory('getOrphanVisits', getOrphanVisits, 'buildShlinkApiClient');
  bottle.serviceFactory('cancelGetOrphanVisits', () => cancelGetOrphanVisits);

  bottle.serviceFactory('createNewVisits', () => createNewVisits);
  bottle.serviceFactory('loadVisitsOverview', loadVisitsOverview, 'buildShlinkApiClient');
};

export default provideServices;
