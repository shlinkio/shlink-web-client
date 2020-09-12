import Bottle from 'bottlejs';
import ShortUrlVisits from '../ShortUrlVisits';
import { cancelGetShortUrlVisits, getShortUrlVisits } from '../reducers/shortUrlVisits';
import { getShortUrlDetail } from '../reducers/shortUrlDetail';
import MapModal from '../helpers/MapModal';
import { createNewVisits } from '../reducers/visitCreation';
import { cancelGetTagVisits, getTagVisits } from '../reducers/tagVisits';
import TagVisits from '../TagVisits';
import { ConnectDecorator } from '../../container/types';
import * as visitsParser from './VisitsParser';

const provideServices = (bottle: Bottle, connect: ConnectDecorator) => {
  // Components
  bottle.serviceFactory('MapModal', () => MapModal);
  bottle.serviceFactory('ShortUrlVisits', () => ShortUrlVisits);
  bottle.decorator('ShortUrlVisits', connect(
    [ 'shortUrlVisits', 'shortUrlDetail', 'mercureInfo' ],
    [ 'getShortUrlVisits', 'getShortUrlDetail', 'cancelGetShortUrlVisits', 'createNewVisits', 'loadMercureInfo' ],
  ));
  bottle.serviceFactory('TagVisits', TagVisits, 'ColorGenerator');
  bottle.decorator('TagVisits', connect(
    [ 'tagVisits', 'mercureInfo' ],
    [ 'getTagVisits', 'cancelGetTagVisits', 'createNewVisits', 'loadMercureInfo' ],
  ));

  // Services
  bottle.serviceFactory('VisitsParser', () => visitsParser);

  // Actions
  bottle.serviceFactory('getShortUrlVisits', getShortUrlVisits, 'buildShlinkApiClient');
  bottle.serviceFactory('getShortUrlDetail', getShortUrlDetail, 'buildShlinkApiClient');
  bottle.serviceFactory('cancelGetShortUrlVisits', () => cancelGetShortUrlVisits);

  bottle.serviceFactory('getTagVisits', getTagVisits, 'buildShlinkApiClient');
  bottle.serviceFactory('cancelGetTagVisits', () => cancelGetTagVisits);

  bottle.serviceFactory('createNewVisits', () => createNewVisits);
};

export default provideServices;
