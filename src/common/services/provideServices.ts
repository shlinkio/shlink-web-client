import axios from 'axios';
import Bottle from 'bottlejs';
import ScrollToTop from '../ScrollToTop';
import MainHeader from '../MainHeader';
import Home from '../Home';
import MenuLayout from '../MenuLayout';
import AsideMenu from '../AsideMenu';
import ErrorHandler from '../ErrorHandler';
import ShlinkVersionsContainer from '../ShlinkVersionsContainer';
import { ConnectDecorator } from '../../container/types';
import { withoutSelectedServer } from '../../servers/helpers/withoutSelectedServer';
import { sidebarNotPresent, sidebarPresent } from '../reducers/sidebar';
import { ImageDownloader } from './ImageDownloader';
import { ReportExporter } from './ReportExporter';

const provideServices = (bottle: Bottle, connect: ConnectDecorator) => {
  // Services
  bottle.constant('window', (global as any).window);
  bottle.constant('console', global.console);
  bottle.constant('axios', axios);

  bottle.service('ImageDownloader', ImageDownloader, 'axios', 'window');
  bottle.service('ReportExporter', ReportExporter, 'window', 'jsonToCsv');

  // Components
  bottle.serviceFactory('ScrollToTop', ScrollToTop);

  bottle.serviceFactory('MainHeader', MainHeader, 'ServersDropdown');

  bottle.serviceFactory('Home', () => Home);
  bottle.decorator('Home', withoutSelectedServer);
  bottle.decorator('Home', connect(['servers'], ['resetSelectedServer']));

  bottle.serviceFactory(
    'MenuLayout',
    MenuLayout,
    'TagsList',
    'ShortUrlsList',
    'AsideMenu',
    'CreateShortUrl',
    'ShortUrlVisits',
    'TagVisits',
    'OrphanVisits',
    'NonOrphanVisits',
    'ServerError',
    'Overview',
    'EditShortUrl',
    'ManageDomains',
  );
  bottle.decorator('MenuLayout', connect(['selectedServer'], ['selectServer', 'sidebarPresent', 'sidebarNotPresent']));

  bottle.serviceFactory('AsideMenu', AsideMenu, 'DeleteServerButton');

  bottle.serviceFactory('ShlinkVersionsContainer', () => ShlinkVersionsContainer);
  bottle.decorator('ShlinkVersionsContainer', connect(['selectedServer', 'sidebar']));

  bottle.serviceFactory('ErrorHandler', ErrorHandler, 'window', 'console');

  // Actions
  bottle.serviceFactory('sidebarPresent', () => sidebarPresent);
  bottle.serviceFactory('sidebarNotPresent', () => sidebarNotPresent);
};

export default provideServices;
