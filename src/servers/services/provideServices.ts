import csvjson from 'csvjson';
import Bottle from 'bottlejs';
import CreateServer from '../CreateServer';
import ServersDropdown from '../ServersDropdown';
import DeleteServerModal from '../DeleteServerModal';
import DeleteServerButton from '../DeleteServerButton';
import { EditServer } from '../EditServer';
import ImportServersBtn from '../helpers/ImportServersBtn';
import { resetSelectedServer, selectServer } from '../reducers/selectedServer';
import { createServer, createServers, deleteServer, editServer, setAutoConnect } from '../reducers/servers';
import { fetchServers } from '../reducers/remoteServers';
import ForServerVersion from '../helpers/ForServerVersion';
import { ServerError } from '../helpers/ServerError';
import { ConnectDecorator } from '../../container/types';
import { withoutSelectedServer } from '../helpers/withoutSelectedServer';
import { Overview } from '../Overview';
import { ManageServers } from '../ManageServers';
import { ManageServersRow } from '../ManageServersRow';
import { ManageServersRowDropdown } from '../ManageServersRowDropdown';
import { ServersImporter } from './ServersImporter';
import ServersExporter from './ServersExporter';

const provideServices = (bottle: Bottle, connect: ConnectDecorator) => {
  // Components
  bottle.serviceFactory(
    'ManageServers',
    ManageServers,
    'ServersExporter',
    'ImportServersBtn',
    'useStateFlagTimeout',
    'ManageServersRow',
  );
  bottle.decorator('ManageServers', connect([ 'servers' ]));

  bottle.serviceFactory('ManageServersRow', ManageServersRow, 'ManageServersRowDropdown');

  bottle.serviceFactory('ManageServersRowDropdown', ManageServersRowDropdown, 'DeleteServerModal');
  bottle.decorator('ManageServersRowDropdown', connect(null, [ 'setAutoConnect' ]));

  bottle.serviceFactory('CreateServer', CreateServer, 'ImportServersBtn', 'useStateFlagTimeout');
  bottle.decorator('CreateServer', withoutSelectedServer);
  bottle.decorator('CreateServer', connect([ 'selectedServer', 'servers' ], [ 'createServer', 'resetSelectedServer' ]));

  bottle.serviceFactory('EditServer', EditServer, 'ServerError');
  bottle.decorator('EditServer', connect([ 'selectedServer' ], [ 'editServer', 'selectServer' ]));

  bottle.serviceFactory('ServersDropdown', () => ServersDropdown);
  bottle.decorator('ServersDropdown', connect([ 'servers', 'selectedServer' ]));

  bottle.serviceFactory('DeleteServerModal', () => DeleteServerModal);
  bottle.decorator('DeleteServerModal', connect(null, [ 'deleteServer' ]));

  bottle.serviceFactory('DeleteServerButton', DeleteServerButton, 'DeleteServerModal');

  bottle.serviceFactory('ImportServersBtn', ImportServersBtn, 'ServersImporter');
  bottle.decorator('ImportServersBtn', connect([ 'servers' ], [ 'createServers' ]));

  bottle.serviceFactory('ForServerVersion', () => ForServerVersion);
  bottle.decorator('ForServerVersion', connect([ 'selectedServer' ]));

  bottle.serviceFactory('ServerError', ServerError, 'DeleteServerButton');
  bottle.decorator('ServerError', connect([ 'servers', 'selectedServer' ]));

  bottle.serviceFactory('Overview', Overview, 'ShortUrlsTable', 'CreateShortUrl', 'ForServerVersion');
  bottle.decorator('Overview', connect(
    [ 'shortUrlsList', 'tagsList', 'selectedServer', 'mercureInfo', 'visitsOverview' ],
    [ 'listShortUrls', 'listTags', 'createNewVisits', 'loadMercureInfo', 'loadVisitsOverview' ],
  ));

  // Services
  bottle.constant('csvjson', csvjson);
  bottle.constant('fileReaderFactory', () => new FileReader());
  bottle.service('ServersImporter', ServersImporter, 'csvjson', 'fileReaderFactory');
  bottle.service('ServersExporter', ServersExporter, 'Storage', 'window', 'csvjson');

  // Actions
  bottle.serviceFactory('selectServer', selectServer, 'buildShlinkApiClient', 'loadMercureInfo');
  bottle.serviceFactory('createServer', () => createServer);
  bottle.serviceFactory('createServers', () => createServers);
  bottle.serviceFactory('deleteServer', () => deleteServer);
  bottle.serviceFactory('editServer', () => editServer);
  bottle.serviceFactory('setAutoConnect', () => setAutoConnect);
  bottle.serviceFactory('fetchServers', fetchServers, 'axios');

  bottle.serviceFactory('resetSelectedServer', () => resetSelectedServer);
};

export default provideServices;
