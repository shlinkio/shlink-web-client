import Bottle from 'bottlejs';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
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
import TagsList from '../tags/TagsList';
import { filterTags, forceListTags, listTags } from '../tags/reducers/tagsList';
import ShortUrls from '../short-urls/ShortUrls';
import SearchBar from '../short-urls/SearchBar';
import { listShortUrls } from '../short-urls/reducers/shortUrlsList';
import ShortUrlsList from '../short-urls/ShortUrlsList';
import { resetShortUrlParams } from '../short-urls/reducers/shortUrlsListParams';
import Tag from '../tags/helpers/Tag';
import { ColorGenerator } from '../utils/ColorGenerator';
import { Storage } from '../utils/Storage';
import ShortUrlsRow from '../short-urls/helpers/ShortUrlsRow';
import ShortUrlsRowMenu from '../short-urls/helpers/ShortUrlsRowMenu';
import { ShlinkApiClient } from '../api/ShlinkApiClient';
import DeleteServerModal from '../servers/DeleteServerModal';
import DeleteServerButton from '../servers/DeleteServerButton';
import AsideMenu from '../common/AsideMenu';
import ImportServersBtn from '../servers/helpers/ImportServersBtn';
import { ServersImporter } from '../servers/services/ServersImporter';
import { ServersExporter } from '../servers/services/ServersExporter';
import { ServersService } from '../servers/services/ServersService';
import CreateShortUrl from '../short-urls/CreateShortUrl';
import { createShortUrl, resetCreateShortUrl } from '../short-urls/reducers/shortUrlCreation';
import TagsSelector from '../tags/helpers/TagsSelector';
import DeleteShortUrlModal from '../short-urls/helpers/DeleteShortUrlModal';
import { deleteShortUrl, resetDeleteShortUrl, shortUrlDeleted } from '../short-urls/reducers/shortUrlDeletion';
import EditTagsModal from '../short-urls/helpers/EditTagsModal';
import { editShortUrlTags, resetShortUrlsTags, shortUrlTagsEdited } from '../short-urls/reducers/shortUrlTags';

const bottle = new Bottle();

bottle.constant('ScrollToTop', ScrollToTop);
bottle.decorator('ScrollToTop', withRouter);

bottle.serviceFactory('MainHeader', MainHeader, 'ServersDropdown');
bottle.decorator('MainHeader', withRouter);

bottle.serviceFactory('Home', () => Home);
bottle.decorator('Home', connect(pick([ 'servers' ]), { resetSelectedServer }));

bottle.serviceFactory('MenuLayout', MenuLayout, 'TagsList', 'ShortUrls', 'AsideMenu', 'CreateShortUrl');
bottle.decorator(
  'MenuLayout',
  compose(
    connect(pick([ 'selectedServer', 'shortUrlsListParams' ]), { selectServer }),
    withRouter
  )
);

bottle.serviceFactory('CreateServer', CreateServer, 'ImportServersBtn');
bottle.decorator('CreateServer', connect(pick([ 'selectedServer' ]), { createServer, resetSelectedServer }));

bottle.serviceFactory('App', App, 'MainHeader', 'Home', 'MenuLayout', 'CreateServer');

bottle.serviceFactory('ServersDropdown', ServersDropdown, 'ServersExporter');
bottle.decorator('ServersDropdown', connect(pick([ 'servers', 'selectedServer' ]), { listServers, selectServer }));

bottle.serviceFactory('TagsList', () => TagsList);
bottle.decorator('TagsList', connect(pick([ 'tagsList' ]), { forceListTags, filterTags }));

bottle.serviceFactory('ShortUrls', ShortUrls, 'SearchBar', 'ShortUrlsList');
bottle.decorator('ShortUrls', connect(
  (state) => assoc('shortUrlsList', state.shortUrlsList.shortUrls, state.shortUrlsList)
));

bottle.serviceFactory('SearchBar', SearchBar, 'Tag');
bottle.decorator('SearchBar', connect(pick([ 'shortUrlsListParams' ]), { listShortUrls }));

bottle.serviceFactory('ShortUrlsList', ShortUrlsList, 'ShortUrlsRow');
bottle.decorator('ShortUrlsList', connect(
  pick([ 'selectedServer', 'shortUrlsListParams' ]),
  { listShortUrls, resetShortUrlParams }
));

bottle.serviceFactory('Tag', Tag, 'ColorGenerator');

bottle.constant('localStorage', global.localStorage);
bottle.service('Storage', Storage, 'localStorage');
bottle.service('ColorGenerator', ColorGenerator, 'Storage');

bottle.serviceFactory('ShortUrlsRow', ShortUrlsRow, 'Tag', 'ShortUrlsRowMenu');

bottle.serviceFactory('ShortUrlsRowMenu', ShortUrlsRowMenu, 'DeleteShortUrlModal', 'EditTagsModal');

bottle.constant('axios', axios);
bottle.service('ShlinkApiClient', ShlinkApiClient, 'axios');

bottle.serviceFactory('DeleteServerModal', () => DeleteServerModal);
bottle.decorator('DeleteServerModal', compose(withRouter, connect(null, { deleteServer })));

bottle.serviceFactory('DeleteServerButton', DeleteServerButton, 'DeleteServerModal');
bottle.serviceFactory('AsideMenu', AsideMenu, 'DeleteServerButton');

bottle.serviceFactory('ImportServersBtn', ImportServersBtn, 'ServersImporter');
bottle.decorator('ImportServersBtn', connect(null, { createServers }));

bottle.constant('csvjson', csvjson);
bottle.constant('window', global.window);
bottle.service('ServersImporter', ServersImporter, 'csvjson');
bottle.service('ServersService', ServersService, 'Storage');
bottle.service('ServersExporter', ServersExporter, 'ServersService', 'window', 'csvjson');

bottle.serviceFactory('CreateShortUrl', CreateShortUrl, 'TagsSelector');
bottle.decorator('CreateShortUrl', connect(pick([ 'shortUrlCreationResult' ]), {
  createShortUrl,
  resetCreateShortUrl,
}));

bottle.serviceFactory('TagsSelector', TagsSelector, 'ColorGenerator');
bottle.decorator('TagsSelector', connect(pick([ 'tagsList' ]), { listTags }));

bottle.serviceFactory('DeleteShortUrlModal', () => DeleteShortUrlModal);
bottle.decorator('DeleteShortUrlModal', connect(
  pick([ 'shortUrlDeletion' ]),
  { deleteShortUrl, resetDeleteShortUrl, shortUrlDeleted }
));
bottle.serviceFactory('EditTagsModal', EditTagsModal, 'TagsSelector');
bottle.decorator('EditTagsModal', connect(
  pick([ 'shortUrlTags' ]),
  { editShortUrlTags, resetShortUrlsTags, shortUrlTagsEdited }
));

export default bottle.container;
