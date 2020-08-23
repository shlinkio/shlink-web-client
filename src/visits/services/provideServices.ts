import Bottle from 'bottlejs';
import ShortUrlVisits from '../ShortUrlVisits';
import { cancelGetShortUrlVisits, getShortUrlVisits } from '../reducers/shortUrlVisits';
import { getShortUrlDetail } from '../reducers/shortUrlDetail';
import OpenMapModalBtn from '../helpers/OpenMapModalBtn';
import MapModal from '../helpers/MapModal';
import VisitsStats from '../VisitsStats';
import { createNewVisit } from '../reducers/visitCreation';
import { cancelGetTagVisits, getTagVisits } from '../reducers/tagVisits';
import TagVisits from '../TagVisits';
import { ConnectDecorator } from '../../container/types';
import * as visitsParser from './VisitsParser';

const provideServices = (bottle: Bottle, connect: ConnectDecorator) => {
  // Components
  bottle.serviceFactory('OpenMapModalBtn', OpenMapModalBtn, 'MapModal');
  bottle.serviceFactory('MapModal', () => MapModal);
  bottle.serviceFactory('VisitsStats', VisitsStats, 'VisitsParser', 'OpenMapModalBtn');
  bottle.serviceFactory('ShortUrlVisits', ShortUrlVisits, 'VisitsStats');
  bottle.decorator('ShortUrlVisits', connect(
    [ 'shortUrlVisits', 'shortUrlDetail', 'mercureInfo' ],
    [ 'getShortUrlVisits', 'getShortUrlDetail', 'cancelGetShortUrlVisits', 'createNewVisit', 'loadMercureInfo' ],
  ));
  bottle.serviceFactory('TagVisits', TagVisits, 'VisitsStats', 'ColorGenerator');
  bottle.decorator('TagVisits', connect(
    [ 'tagVisits', 'mercureInfo' ],
    [ 'getTagVisits', 'cancelGetTagVisits', 'createNewVisit', 'loadMercureInfo' ],
  ));

  // Services
  bottle.serviceFactory('VisitsParser', () => visitsParser);

  // Actions
  bottle.serviceFactory('getShortUrlVisits', getShortUrlVisits, 'buildShlinkApiClient');
  bottle.serviceFactory('getShortUrlDetail', getShortUrlDetail, 'buildShlinkApiClient');
  bottle.serviceFactory('cancelGetShortUrlVisits', () => cancelGetShortUrlVisits);

  bottle.serviceFactory('getTagVisits', getTagVisits, 'buildShlinkApiClient');
  bottle.serviceFactory('cancelGetTagVisits', () => cancelGetTagVisits);

  bottle.serviceFactory('createNewVisit', () => createNewVisit);
};

export default provideServices;
