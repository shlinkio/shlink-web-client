import type Bottle from 'bottlejs';
import { ShlinkWebComponent } from '../ShlinkWebComponent';

export const provideServices = (bottle: Bottle) => {
  bottle.serviceFactory(
    'ShlinkWebComponent',
    ShlinkWebComponent,
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
    'store',
  );
};
