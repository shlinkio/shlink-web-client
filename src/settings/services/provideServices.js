import RealTimeUpdates from '../RealTimeUpdates';
import Settings from '../Settings';
import { loadRealTimeUpdates, setRealTimeUpdates } from '../reducers/settings';
import SettingsService from './SettingsService';

const provideServices = (bottle, connect) => {
  // Components
  bottle.serviceFactory('Settings', Settings, 'RealTimeUpdates');

  bottle.serviceFactory('RealTimeUpdates', () => RealTimeUpdates);
  bottle.decorator('RealTimeUpdates', connect([ 'settings' ], [ 'setRealTimeUpdates' ]));

  // Services
  bottle.service('SettingsService', SettingsService, 'Storage');

  // Actions
  bottle.serviceFactory('setRealTimeUpdates', setRealTimeUpdates, 'SettingsService', 'loadRealTimeUpdates');
  bottle.serviceFactory('loadRealTimeUpdates', loadRealTimeUpdates, 'SettingsService');
};

export default provideServices;
