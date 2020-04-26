import RealTimeUpdates from '../RealTimeUpdates';
import Settings from '../Settings';
import { setRealTimeUpdates } from '../reducers/settings';

const provideServices = (bottle, connect) => {
  // Components
  bottle.serviceFactory('Settings', Settings, 'RealTimeUpdates');

  bottle.serviceFactory('RealTimeUpdates', () => RealTimeUpdates);
  bottle.decorator('RealTimeUpdates', connect([ 'settings' ], [ 'setRealTimeUpdates' ]));

  // Actions
  bottle.serviceFactory('setRealTimeUpdates', () => setRealTimeUpdates);
};

export default provideServices;
