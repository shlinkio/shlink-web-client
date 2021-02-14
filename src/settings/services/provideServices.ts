import Bottle from 'bottlejs';
import RealTimeUpdates from '../RealTimeUpdates';
import Settings from '../Settings';
import { setRealTimeUpdatesInterval, setShortUrlCreationSettings, toggleRealTimeUpdates } from '../reducers/settings';
import { ConnectDecorator } from '../../container/types';
import { withoutSelectedServer } from '../../servers/helpers/withoutSelectedServer';
import { ShortUrlCreation } from '../ShortUrlCreation';

const provideServices = (bottle: Bottle, connect: ConnectDecorator) => {
  // Components
  bottle.serviceFactory('Settings', Settings, 'RealTimeUpdates', 'ShortUrlCreation');
  bottle.decorator('Settings', withoutSelectedServer);
  bottle.decorator('Settings', connect(null, [ 'resetSelectedServer' ]));

  bottle.serviceFactory('RealTimeUpdates', () => RealTimeUpdates);
  bottle.decorator(
    'RealTimeUpdates',
    connect([ 'settings' ], [ 'toggleRealTimeUpdates', 'setRealTimeUpdatesInterval' ]),
  );

  bottle.serviceFactory('ShortUrlCreation', () => ShortUrlCreation);
  bottle.decorator('ShortUrlCreation', connect([ 'settings' ], [ 'setShortUrlCreationSettings' ]));

  // Actions
  bottle.serviceFactory('toggleRealTimeUpdates', () => toggleRealTimeUpdates);
  bottle.serviceFactory('setRealTimeUpdatesInterval', () => setRealTimeUpdatesInterval);
  bottle.serviceFactory('setShortUrlCreationSettings', () => setShortUrlCreationSettings);
};

export default provideServices;
