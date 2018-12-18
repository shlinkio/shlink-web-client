import Bottle from 'bottlejs';
import { withRouter } from 'react-router-dom';
import { connect as reduxConnect } from 'react-redux';
import { assoc, pick } from 'ramda';
import csvjson from 'csvjson';
import axios from 'axios';
import App from '../App';
import ScrollToTop from '../common/ScrollToTop';
import MainHeader from '../common/MainHeader';
import { resetSelectedServer, selectServer } from '../servers/reducers/selectedServer';
import Home from '../common/Home';
import MenuLayout from '../common/MenuLayout';
import { createServer, createServers, deleteServer, listServers } from '../servers/reducers/server';
import CreateServer from '../servers/CreateServer';
import ServersDropdown from '../servers/ServersDropdown';
import ShortUrls from '../short-urls/ShortUrls';
import SearchBar from '../short-urls/SearchBar';
import { listShortUrls } from '../short-urls/reducers/shortUrlsList';
import ShortUrlsList from '../short-urls/ShortUrlsList';
import { resetShortUrlParams } from '../short-urls/reducers/shortUrlsListParams';
import { ColorGenerator } from '../utils/ColorGenerator';
import { Storage } from '../utils/Storage';
import ShortUrlsRow from '../short-urls/helpers/ShortUrlsRow';
import ShortUrlsRowMenu from '../short-urls/helpers/ShortUrlsRowMenu';
import ShlinkApiClient from '../api/ShlinkApiClient';
import DeleteServerModal from '../servers/DeleteServerModal';
import DeleteServerButton from '../servers/DeleteServerButton';
import AsideMenu from '../common/AsideMenu';
import ImportServersBtn from '../servers/helpers/ImportServersBtn';
import { ServersImporter } from '../servers/services/ServersImporter';
import { ServersExporter } from '../servers/services/ServersExporter';
import { ServersService } from '../servers/services/ServersService';
import CreateShortUrl from '../short-urls/CreateShortUrl';
import { createShortUrl, resetCreateShortUrl } from '../short-urls/reducers/shortUrlCreation';
import DeleteShortUrlModal from '../short-urls/helpers/DeleteShortUrlModal';
import { deleteShortUrl, resetDeleteShortUrl, shortUrlDeleted } from '../short-urls/reducers/shortUrlDeletion';
import EditTagsModal from '../short-urls/helpers/EditTagsModal';
import { editShortUrlTags, resetShortUrlsTags, shortUrlTagsEdited } from '../short-urls/reducers/shortUrlTags';
import buildShlinkApiClient from '../api/ShlinkApiClientBuilder';
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
    pick(propsFromState),
    Array.isArray(actionServiceNames) ? actionServiceNames.reduce(mapActionService, {}) : actionServiceNames
  );

bottle.constant('ScrollToTop', ScrollToTop);
bottle.decorator('ScrollToTop', withRouter);

bottle.serviceFactory('MainHeader', MainHeader, 'ServersDropdown');
bottle.decorator('MainHeader', withRouter);

bottle.serviceFactory('Home', () => Home);
bottle.decorator('Home', connect([ 'servers' ], { resetSelectedServer }));

bottle.serviceFactory(
  'MenuLayout',
  MenuLayout,
  'TagsList',
  'ShortUrls',
  'AsideMenu',
  'CreateShortUrl',
  'ShortUrlVisits'
);
bottle.decorator('MenuLayout', connect([ 'selectedServer', 'shortUrlsListParams' ], { selectServer }));
bottle.decorator('MenuLayout', withRouter);

bottle.serviceFactory('CreateServer', CreateServer, 'ImportServersBtn');
bottle.decorator('CreateServer', connect([ 'selectedServer' ], { createServer, resetSelectedServer }));

bottle.serviceFactory('App', App, 'MainHeader', 'Home', 'MenuLayout', 'CreateServer');

bottle.serviceFactory('ServersDropdown', ServersDropdown, 'ServersExporter');
bottle.decorator('ServersDropdown', connect([ 'servers', 'selectedServer' ], { listServers, selectServer }));

bottle.serviceFactory('ShortUrls', ShortUrls, 'SearchBar', 'ShortUrlsList');
bottle.decorator('ShortUrls', reduxConnect(
  (state) => assoc('shortUrlsList', state.shortUrlsList.shortUrls, state.shortUrlsList)
));

bottle.serviceFactory('SearchBar', SearchBar, 'ColorGenerator');
bottle.decorator('SearchBar', connect([ 'shortUrlsListParams' ], { listShortUrls }));

bottle.serviceFactory('ShortUrlsList', ShortUrlsList, 'ShortUrlsRow');
bottle.decorator('ShortUrlsList', connect(
  [ 'selectedServer', 'shortUrlsListParams' ],
  { listShortUrls, resetShortUrlParams }
));

bottle.constant('localStorage', global.localStorage);
bottle.service('Storage', Storage, 'localStorage');
bottle.service('ColorGenerator', ColorGenerator, 'Storage');

bottle.serviceFactory('buildShlinkApiClient', buildShlinkApiClient, 'axios');

bottle.serviceFactory('ShortUrlsRow', ShortUrlsRow, 'ShortUrlsRowMenu', 'ColorGenerator');

bottle.serviceFactory('ShortUrlsRowMenu', ShortUrlsRowMenu, 'DeleteShortUrlModal', 'EditTagsModal');

bottle.constant('axios', axios);
bottle.service('ShlinkApiClient', ShlinkApiClient, 'axios');

bottle.serviceFactory('DeleteServerModal', () => DeleteServerModal);
bottle.decorator('DeleteServerModal', withRouter);
bottle.decorator('DeleteServerModal', reduxConnect(null, { deleteServer }));

bottle.serviceFactory('DeleteServerButton', DeleteServerButton, 'DeleteServerModal');
bottle.serviceFactory('AsideMenu', AsideMenu, 'DeleteServerButton');

bottle.serviceFactory('ImportServersBtn', ImportServersBtn, 'ServersImporter');
bottle.decorator('ImportServersBtn', reduxConnect(null, { createServers }));

bottle.constant('csvjson', csvjson);
bottle.constant('window', global.window);
bottle.service('ServersImporter', ServersImporter, 'csvjson');
bottle.service('ServersService', ServersService, 'Storage');
bottle.service('ServersExporter', ServersExporter, 'ServersService', 'window', 'csvjson');

bottle.serviceFactory('CreateShortUrl', CreateShortUrl, 'TagsSelector');
bottle.decorator('CreateShortUrl', connect([ 'shortUrlCreationResult' ], {
  createShortUrl,
  resetCreateShortUrl,
}));

bottle.serviceFactory('DeleteShortUrlModal', () => DeleteShortUrlModal);
bottle.decorator('DeleteShortUrlModal', connect(
  [ 'shortUrlDeletion' ],
  { deleteShortUrl, resetDeleteShortUrl, shortUrlDeleted }
));

bottle.serviceFactory('EditTagsModal', EditTagsModal, 'TagsSelector');
bottle.decorator('EditTagsModal', connect(
  [ 'shortUrlTags' ],
  [ 'editShortUrlTags', 'resetShortUrlsTags', 'shortUrlTagsEdited' ]
));

bottle.serviceFactory('editShortUrlTags', editShortUrlTags, 'buildShlinkApiClient');
bottle.serviceFactory('resetShortUrlsTags', () => resetShortUrlsTags);
bottle.serviceFactory('shortUrlTagsEdited', () => shortUrlTagsEdited);

provideTagsServices(bottle, connect);
provideVisitsServices(bottle, connect);

export default container;
