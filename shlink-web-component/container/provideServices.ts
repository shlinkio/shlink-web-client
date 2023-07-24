import type Bottle from 'bottlejs';
import { Main } from '../Main';
import type { ConnectDecorator } from './index';

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
};
