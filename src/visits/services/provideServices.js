import ShortUrlVisits from '../ShortUrlVisits';
import { cancelGetShortUrlVisits, getShortUrlVisits } from '../reducers/shortUrlVisits';
import { getShortUrlDetail } from '../reducers/shortUrlDetail';
import * as visitsParser from './VisitsParser';

const provideServices = (bottle, connect) => {
  // Components
  bottle.serviceFactory('ShortUrlVisits', ShortUrlVisits, 'VisitsParser');
  bottle.decorator('ShortUrlVisits', connect(
    [ 'shortUrlVisits', 'shortUrlDetail' ],
    [ 'getShortUrlVisits', 'getShortUrlDetail', 'cancelGetShortUrlVisits' ]
  ));

  // Services
  bottle.serviceFactory('VisitsParser', () => visitsParser);

  // Actions
  bottle.serviceFactory('getShortUrlVisits', getShortUrlVisits, 'buildShlinkApiClient');
  bottle.serviceFactory('getShortUrlDetail', getShortUrlDetail, 'buildShlinkApiClient');
  bottle.serviceFactory('cancelGetShortUrlVisits', () => cancelGetShortUrlVisits);
};

export default provideServices;
