import { FetchHttpClient } from '@shlinkio/shlink-js-sdk/fetch';
import { ShlinkWebComponent } from '@shlinkio/shlink-web-component';
import type Bottle from 'bottlejs';
import type { ConnectDecorator } from '../../container/types';
import { withoutSelectedServer } from '../../servers/helpers/withoutSelectedServer';
import { ErrorHandler } from '../ErrorHandler';
import { Home } from '../Home';
import { MainHeaderFactory } from '../MainHeader';
import { ScrollToTop } from '../ScrollToTop';
import { ShlinkVersionsContainer } from '../ShlinkVersionsContainer';
import { ShlinkWebComponentContainerFactory } from '../ShlinkWebComponentContainer';

export const provideServices = (bottle: Bottle, connect: ConnectDecorator) => {
  // Services
  bottle.constant('window', window);
  bottle.constant('console', console);
  bottle.constant('fetch', window.fetch.bind(window));
  bottle.service('HttpClient', FetchHttpClient, 'fetch');

  // Components
  bottle.serviceFactory('ScrollToTop', () => ScrollToTop);

  bottle.factory('MainHeader', MainHeaderFactory);

  bottle.serviceFactory('Home', () => Home);
  bottle.decorator('Home', withoutSelectedServer);
  bottle.decorator('Home', connect(['servers'], ['resetSelectedServer']));

  bottle.serviceFactory('ShlinkWebComponent', () => ShlinkWebComponent);
  bottle.factory('ShlinkWebComponentContainer', ShlinkWebComponentContainerFactory);
  bottle.decorator('ShlinkWebComponentContainer', connect(['selectedServer', 'settings'], ['selectServer']));

  bottle.serviceFactory('ShlinkVersionsContainer', () => ShlinkVersionsContainer);
  bottle.decorator('ShlinkVersionsContainer', connect(['selectedServer']));

  bottle.serviceFactory('ErrorHandler', () => ErrorHandler);
};
