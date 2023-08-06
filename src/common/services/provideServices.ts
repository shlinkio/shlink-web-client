import { ShlinkWebComponent } from '@shlinkio/shlink-web-component';
import type Bottle from 'bottlejs';
import type { ConnectDecorator } from '../../container/types';
import { withoutSelectedServer } from '../../servers/helpers/withoutSelectedServer';
import { ErrorHandler } from '../ErrorHandler';
import { Home } from '../Home';
import { MainHeader } from '../MainHeader';
import { sidebarNotPresent, sidebarPresent } from '../reducers/sidebar';
import { ScrollToTop } from '../ScrollToTop';
import { ShlinkVersionsContainer } from '../ShlinkVersionsContainer';
import { ShlinkWebComponentContainer } from '../ShlinkWebComponentContainer';
import { HttpClient } from './HttpClient';

export const provideServices = (bottle: Bottle, connect: ConnectDecorator) => {
  // Services
  bottle.constant('window', window);
  bottle.constant('console', console);
  bottle.constant('fetch', window.fetch.bind(window));
  bottle.service('HttpClient', HttpClient, 'fetch');

  // Components
  bottle.serviceFactory('ScrollToTop', () => ScrollToTop);

  bottle.serviceFactory('MainHeader', MainHeader, 'ServersDropdown');

  bottle.serviceFactory('Home', () => Home);
  bottle.decorator('Home', withoutSelectedServer);
  bottle.decorator('Home', connect(['servers'], ['resetSelectedServer']));

  bottle.serviceFactory('ShlinkWebComponent', () => ShlinkWebComponent);
  bottle.serviceFactory(
    'ShlinkWebComponentContainer',
    ShlinkWebComponentContainer,
    'buildShlinkApiClient',
    'TagColorsStorage',
    'ShlinkWebComponent',
    'ServerError',
  );
  bottle.decorator('ShlinkWebComponentContainer', connect(
    ['selectedServer', 'settings'],
    ['selectServer', 'sidebarPresent', 'sidebarNotPresent'],
  ));

  bottle.serviceFactory('ShlinkVersionsContainer', () => ShlinkVersionsContainer);
  bottle.decorator('ShlinkVersionsContainer', connect(['selectedServer', 'sidebar']));

  bottle.serviceFactory('ErrorHandler', ErrorHandler, 'window', 'console');

  // Actions
  bottle.serviceFactory('sidebarPresent', () => sidebarPresent);
  bottle.serviceFactory('sidebarNotPresent', () => sidebarNotPresent);
};
