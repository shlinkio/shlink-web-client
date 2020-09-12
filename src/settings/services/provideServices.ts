import Bottle from 'bottlejs';
import RealTimeUpdates from '../RealTimeUpdates';
import Settings from '../Settings';
import { setRealTimeUpdatesInterval, toggleRealTimeUpdates } from '../reducers/settings';
import { ConnectDecorator } from '../../container/types';
import { withoutSelectedServer } from '../../servers/helpers/withoutSelectedServer';

const provideServices = (bottle: Bottle, connect: ConnectDecorator) => {
  // Components
  bottle.serviceFactory('Settings', Settings, 'RealTimeUpdates');
  bottle.decorator('Settings', withoutSelectedServer);
  bottle.decorator('Settings', connect(null, [ 'resetSelectedServer' ]));

  // Services
  bottle.serviceFactory('RealTimeUpdates', () => RealTimeUpdates);
  bottle.decorator(
    'RealTimeUpdates',
    connect([ 'settings' ], [ 'toggleRealTimeUpdates', 'setRealTimeUpdatesInterval' ]),
  );

  // Actions
  bottle.serviceFactory('toggleRealTimeUpdates', () => toggleRealTimeUpdates);
  bottle.serviceFactory('setRealTimeUpdatesInterval', () => setRealTimeUpdatesInterval);
};

export default provideServices;
