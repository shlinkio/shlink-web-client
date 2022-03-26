import Bottle from 'bottlejs';
import { appUpdateAvailable, resetAppUpdate } from '../reducers/appUpdates';
import App from '../App';
import { ConnectDecorator } from '../../container/types';

const provideServices = (bottle: Bottle, connect: ConnectDecorator) => {
  // Components
  bottle.serviceFactory(
    'App',
    App,
    'MainHeader',
    'Home',
    'MenuLayout',
    'CreateServer',
    'EditServer',
    'Settings',
    'ManageServers',
    'ShlinkVersionsContainer',
  );
  bottle.decorator('App', connect(['servers', 'settings', 'appUpdated'], ['fetchServers', 'resetAppUpdate']));

  // Actions
  bottle.serviceFactory('appUpdateAvailable', () => appUpdateAvailable);
  bottle.serviceFactory('resetAppUpdate', () => resetAppUpdate);
};

export default provideServices;
