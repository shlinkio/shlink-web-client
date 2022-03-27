import Bottle from 'bottlejs';
import MapModal from '../helpers/MapModal';
import { createNewVisits } from '../reducers/visitCreation';
import ShortUrlVisits from '../ShortUrlVisits';
import TagVisits from '../TagVisits';
import { OrphanVisits } from '../OrphanVisits';
import { NonOrphanVisits } from '../NonOrphanVisits';
import { cancelGetShortUrlVisits, getShortUrlVisits } from '../reducers/shortUrlVisits';
import { cancelGetTagVisits, getTagVisits } from '../reducers/tagVisits';
import { cancelGetOrphanVisits, getOrphanVisits } from '../reducers/orphanVisits';
import { cancelGetNonOrphanVisits, getNonOrphanVisits } from '../reducers/nonOrphanVisits';
import { ConnectDecorator } from '../../container/types';
import { loadVisitsOverview } from '../reducers/visitsOverview';
import * as visitsParser from './VisitsParser';

const provideServices = (bottle: Bottle, connect: ConnectDecorator) => {
  // Components
  bottle.serviceFactory('MapModal', () => MapModal);

  bottle.serviceFactory('ShortUrlVisits', ShortUrlVisits, 'ReportExporter');
  bottle.decorator('ShortUrlVisits', connect(
    ['shortUrlVisits', 'shortUrlDetail', 'mercureInfo', 'settings', 'selectedServer'],
    ['getShortUrlVisits', 'getShortUrlDetail', 'cancelGetShortUrlVisits', 'createNewVisits', 'loadMercureInfo'],
  ));

  bottle.serviceFactory('TagVisits', TagVisits, 'ColorGenerator', 'ReportExporter');
  bottle.decorator('TagVisits', connect(
    ['tagVisits', 'mercureInfo', 'settings', 'selectedServer'],
    ['getTagVisits', 'cancelGetTagVisits', 'createNewVisits', 'loadMercureInfo'],
  ));

  bottle.serviceFactory('OrphanVisits', OrphanVisits, 'ReportExporter');
  bottle.decorator('OrphanVisits', connect(
    ['orphanVisits', 'mercureInfo', 'settings', 'selectedServer'],
    ['getOrphanVisits', 'cancelGetOrphanVisits', 'createNewVisits', 'loadMercureInfo'],
  ));

  bottle.serviceFactory('NonOrphanVisits', NonOrphanVisits, 'ReportExporter');
  bottle.decorator('NonOrphanVisits', connect(
    ['nonOrphanVisits', 'mercureInfo', 'settings', 'selectedServer'],
    ['getNonOrphanVisits', 'cancelGetNonOrphanVisits', 'createNewVisits', 'loadMercureInfo'],
  ));

  // Services
  bottle.serviceFactory('VisitsParser', () => visitsParser);

  // Actions
  bottle.serviceFactory('getShortUrlVisits', getShortUrlVisits, 'buildShlinkApiClient');
  bottle.serviceFactory('cancelGetShortUrlVisits', () => cancelGetShortUrlVisits);

  bottle.serviceFactory('getTagVisits', getTagVisits, 'buildShlinkApiClient');
  bottle.serviceFactory('cancelGetTagVisits', () => cancelGetTagVisits);

  bottle.serviceFactory('getOrphanVisits', getOrphanVisits, 'buildShlinkApiClient');
  bottle.serviceFactory('cancelGetOrphanVisits', () => cancelGetOrphanVisits);

  bottle.serviceFactory('getNonOrphanVisits', getNonOrphanVisits, 'buildShlinkApiClient');
  bottle.serviceFactory('cancelGetNonOrphanVisits', () => cancelGetNonOrphanVisits);

  bottle.serviceFactory('createNewVisits', () => createNewVisits);
  bottle.serviceFactory('loadVisitsOverview', loadVisitsOverview, 'buildShlinkApiClient');
};

export default provideServices;
