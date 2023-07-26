import type Bottle from 'bottlejs';
import { Main } from '../Main';
import type { ConnectDecorator } from './index';
import { setUpStore } from './store';

export const provideServices = (bottle: Bottle, connect: ConnectDecorator) => {
  bottle.serviceFactory(
    'Main',
    Main,
    'TagsList',
    'ShortUrlsList',
    'CreateShortUrl',
    'ShortUrlVisits',
    'TagVisits',
    'DomainVisits',
    'OrphanVisits',
    'NonOrphanVisits',
    'Overview',
    'EditShortUrl',
    'ManageDomains',
  );
  bottle.decorator('Main', connect(null, ['loadMercureInfo']));

  bottle.factory('store', setUpStore);
};
