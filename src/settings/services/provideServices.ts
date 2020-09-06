import Bottle from 'bottlejs';
import RealTimeUpdates from '../RealTimeUpdates';
import Settings from '../Settings';
import { setRealTimeUpdates } from '../reducers/settings';
import { ConnectDecorator } from '../../container/types';

const provideServices = (bottle: Bottle, connect: ConnectDecorator) => {
  // Components
  bottle.serviceFactory('Settings', Settings, 'RealTimeUpdates');

  // Services
  bottle.serviceFactory('RealTimeUpdates', () => RealTimeUpdates);
  bottle.decorator('RealTimeUpdates', connect([ 'settings' ], [ 'setRealTimeUpdates' ]));

  // Actions
  bottle.serviceFactory('setRealTimeUpdates', () => setRealTimeUpdates);
};

export default provideServices;
