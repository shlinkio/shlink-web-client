import ScrollToTop from '../ScrollToTop';
import MainHeader from '../MainHeader';
import Home from '../Home';
import MenuLayout from '../MenuLayout';
import AsideMenu from '../AsideMenu';

const provideServices = (bottle, connect, withRouter) => {
  bottle.constant('ScrollToTop', ScrollToTop);
  bottle.decorator('ScrollToTop', withRouter);

  bottle.serviceFactory('MainHeader', MainHeader, 'ServersDropdown');
  bottle.decorator('MainHeader', withRouter);

  bottle.serviceFactory('Home', () => Home);
  bottle.decorator('Home', connect([ 'servers' ], [ 'resetSelectedServer' ]));

  bottle.serviceFactory(
    'MenuLayout',
    MenuLayout,
    'TagsList',
    'ShortUrls',
    'AsideMenu',
    'CreateShortUrl',
    'ShortUrlVisits'
  );
  bottle.decorator('MenuLayout', connect([ 'selectedServer', 'shortUrlsListParams' ], [ 'selectServer' ]));
  bottle.decorator('MenuLayout', withRouter);

  bottle.serviceFactory('AsideMenu', AsideMenu, 'DeleteServerButton');
};

export default provideServices;
