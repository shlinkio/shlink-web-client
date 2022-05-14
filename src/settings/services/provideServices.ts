import Bottle from 'bottlejs';
import RealTimeUpdatesSettings from '../RealTimeUpdatesSettings';
import Settings from '../Settings';
import {
  setRealTimeUpdatesInterval,
  setShortUrlCreationSettings,
  setShortUrlsListSettings,
  setTagsSettings,
  setUiSettings,
  setVisitsSettings,
  toggleRealTimeUpdates,
} from '../reducers/settings';
import { ConnectDecorator } from '../../container/types';
import { withoutSelectedServer } from '../../servers/helpers/withoutSelectedServer';
import { ShortUrlCreationSettings } from '../ShortUrlCreationSettings';
import { UserInterfaceSettings } from '../UserInterfaceSettings';
import { VisitsSettings } from '../VisitsSettings';
import { TagsSettings } from '../TagsSettings';
import { ShortUrlsListSettings } from '../ShortUrlsListSettings';

const provideServices = (bottle: Bottle, connect: ConnectDecorator) => {
  // Components
  bottle.serviceFactory(
    'Settings',
    Settings,
    'RealTimeUpdatesSettings',
    'ShortUrlCreationSettings',
    'ShortUrlsListSettings',
    'UserInterfaceSettings',
    'VisitsSettings',
    'TagsSettings',
  );
  bottle.decorator('Settings', withoutSelectedServer);
  bottle.decorator('Settings', connect(null, ['resetSelectedServer']));

  bottle.serviceFactory('RealTimeUpdatesSettings', () => RealTimeUpdatesSettings);
  bottle.decorator(
    'RealTimeUpdatesSettings',
    connect(['settings'], ['toggleRealTimeUpdates', 'setRealTimeUpdatesInterval']),
  );

  bottle.serviceFactory('ShortUrlCreationSettings', () => ShortUrlCreationSettings);
  bottle.decorator('ShortUrlCreationSettings', connect(['settings'], ['setShortUrlCreationSettings']));

  bottle.serviceFactory('UserInterfaceSettings', () => UserInterfaceSettings);
  bottle.decorator('UserInterfaceSettings', connect(['settings'], ['setUiSettings']));

  bottle.serviceFactory('VisitsSettings', () => VisitsSettings);
  bottle.decorator('VisitsSettings', connect(['settings'], ['setVisitsSettings']));

  bottle.serviceFactory('TagsSettings', () => TagsSettings);
  bottle.decorator('TagsSettings', connect(['settings'], ['setTagsSettings']));

  bottle.serviceFactory('ShortUrlsListSettings', () => ShortUrlsListSettings);
  bottle.decorator('ShortUrlsListSettings', connect(['settings'], ['setShortUrlsListSettings']));

  // Actions
  bottle.serviceFactory('toggleRealTimeUpdates', () => toggleRealTimeUpdates);
  bottle.serviceFactory('setRealTimeUpdatesInterval', () => setRealTimeUpdatesInterval);
  bottle.serviceFactory('setShortUrlCreationSettings', () => setShortUrlCreationSettings);
  bottle.serviceFactory('setShortUrlsListSettings', () => setShortUrlsListSettings);
  bottle.serviceFactory('setUiSettings', () => setUiSettings);
  bottle.serviceFactory('setVisitsSettings', () => setVisitsSettings);
  bottle.serviceFactory('setTagsSettings', () => setTagsSettings);
};

export default provideServices;
