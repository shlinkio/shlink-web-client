import type Bottle from 'bottlejs';
import type { ConnectDecorator } from '../../container';
import { Overview } from '../Overview';

export function provideServices(bottle: Bottle, connect: ConnectDecorator) {
  bottle.serviceFactory('Overview', Overview, 'ShortUrlsTable', 'CreateShortUrl');
  bottle.decorator('Overview', connect(
    ['shortUrlsList', 'tagsList', 'selectedServer', 'mercureInfo', 'visitsOverview'],
    ['listShortUrls', 'listTags', 'createNewVisits', 'loadMercureInfo', 'loadVisitsOverview'],
  ));
}
