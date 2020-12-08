import Bottle, { Decorator } from 'bottlejs';
import ScrollToTop from '../ScrollToTop';
import MainHeader from '../MainHeader';
import Home from '../Home';
import MenuLayout from '../MenuLayout';
import AsideMenu from '../AsideMenu';
import ErrorHandler from '../ErrorHandler';
import ShlinkVersions from '../ShlinkVersions';
import { ConnectDecorator } from '../../container/types';
import { withoutSelectedServer } from '../../servers/helpers/withoutSelectedServer';

const provideServices = (bottle: Bottle, connect: ConnectDecorator, withRouter: Decorator) => {
  bottle.constant('window', (global as any).window);
  bottle.constant('console', global.console);

  bottle.serviceFactory('ScrollToTop', ScrollToTop);
  bottle.decorator('ScrollToTop', withRouter);

  bottle.serviceFactory('MainHeader', MainHeader, 'ServersDropdown');
  bottle.decorator('MainHeader', withRouter);

  bottle.serviceFactory('Home', () => Home);
  bottle.decorator('Home', withoutSelectedServer);
  bottle.decorator('Home', connect([ 'servers' ], [ 'resetSelectedServer' ]));

  bottle.serviceFactory(
    'MenuLayout',
    MenuLayout,
    'TagsList',
    'ShortUrls',
    'AsideMenu',
    'CreateShortUrl',
    'ShortUrlVisits',
    'TagVisits',
    'ServerError',
    'Overview',
  );
  bottle.decorator('MenuLayout', connect([ 'selectedServer', 'shortUrlsListParams' ], [ 'selectServer' ]));
  bottle.decorator('MenuLayout', withRouter);

  bottle.serviceFactory('AsideMenu', AsideMenu, 'DeleteServerButton');

  bottle.serviceFactory('ShlinkVersions', () => ShlinkVersions);
  bottle.decorator('ShlinkVersions', connect([ 'selectedServer' ]));

  bottle.serviceFactory('ErrorHandler', ErrorHandler, 'window', 'console');
};

export default provideServices;
