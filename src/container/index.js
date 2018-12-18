import Bottle from 'bottlejs';
import { withRouter } from 'react-router-dom';
import { connect as reduxConnect } from 'react-redux';
import { pick } from 'ramda';
import axios from 'axios';
import App from '../App';
import ScrollToTop from '../common/ScrollToTop';
import MainHeader from '../common/MainHeader';
import Home from '../common/Home';
import MenuLayout from '../common/MenuLayout';
import AsideMenu from '../common/AsideMenu';
import ColorGenerator from '../utils/ColorGenerator';
import Storage from '../utils/Storage';
import buildShlinkApiClient from '../api/ShlinkApiClientBuilder';
import provideShortUrlsServices from '../short-urls/services/provideServices';
import provideServersServices from '../servers/services/provideServices';
import provideVisitsServices from '../visits/services/provideServices';
import provideTagsServices from '../tags/services/provideServices';

const bottle = new Bottle();
const { container } = bottle;

const mapActionService = (map, actionName) => ({
  ...map,

  // Wrap actual action service in a function so that it is lazily created the first time it is called
  [actionName]: (...args) => container[actionName](...args),
});
const connect = (propsFromState, actionServiceNames) =>
  reduxConnect(
    propsFromState ? pick(propsFromState) : null,
    Array.isArray(actionServiceNames) ? actionServiceNames.reduce(mapActionService, {}) : actionServiceNames
  );

bottle.constant('ScrollToTop', ScrollToTop);
bottle.decorator('ScrollToTop', withRouter);

bottle.serviceFactory('App', App, 'MainHeader', 'Home', 'MenuLayout', 'CreateServer');

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

bottle.constant('localStorage', global.localStorage);
bottle.service('Storage', Storage, 'localStorage');
bottle.service('ColorGenerator', ColorGenerator, 'Storage');

bottle.constant('axios', axios);
bottle.serviceFactory('buildShlinkApiClient', buildShlinkApiClient, 'axios');

provideShortUrlsServices(bottle, connect);
provideServersServices(bottle, connect, withRouter);
provideTagsServices(bottle, connect);
provideVisitsServices(bottle, connect);

export default container;
