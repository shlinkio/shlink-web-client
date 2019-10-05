import csvjson from 'csvjson';
import CreateServer from '../CreateServer';
import ServersDropdown from '../ServersDropdown';
import DeleteServerModal from '../DeleteServerModal';
import DeleteServerButton from '../DeleteServerButton';
import ImportServersBtn from '../helpers/ImportServersBtn';
import { resetSelectedServer, selectServer } from '../reducers/selectedServer';
import { createServer, createServers, deleteServer, listServers } from '../reducers/server';
import ServersImporter from './ServersImporter';
import ServersService from './ServersService';
import ServersExporter from './ServersExporter';

const provideServices = (bottle, connect, withRouter) => {
  // Components
  bottle.serviceFactory('CreateServer', CreateServer, 'ImportServersBtn', 'stateFlagTimeout');
  bottle.decorator('CreateServer', connect([ 'selectedServer' ], [ 'createServer', 'resetSelectedServer' ]));

  bottle.serviceFactory('ServersDropdown', ServersDropdown, 'ServersExporter');
  bottle.decorator('ServersDropdown', withRouter);
  bottle.decorator('ServersDropdown', connect([ 'servers', 'selectedServer' ], [ 'listServers', 'selectServer' ]));

  bottle.serviceFactory('DeleteServerModal', () => DeleteServerModal);
  bottle.decorator('DeleteServerModal', withRouter);
  bottle.decorator('DeleteServerModal', connect(null, [ 'deleteServer' ]));

  bottle.serviceFactory('DeleteServerButton', DeleteServerButton, 'DeleteServerModal');

  bottle.serviceFactory('ImportServersBtn', ImportServersBtn, 'ServersImporter');
  bottle.decorator('ImportServersBtn', connect(null, [ 'createServers' ]));

  // Services
  bottle.constant('csvjson', csvjson);
  bottle.service('ServersImporter', ServersImporter, 'csvjson');
  bottle.service('ServersService', ServersService, 'Storage');
  bottle.service('ServersExporter', ServersExporter, 'ServersService', 'window', 'csvjson');

  // Actions
  bottle.serviceFactory('selectServer', selectServer, 'ServersService', 'buildShlinkApiClient');
  bottle.serviceFactory('createServer', createServer, 'ServersService', 'listServers');
  bottle.serviceFactory('createServers', createServers, 'ServersService', 'listServers');
  bottle.serviceFactory('deleteServer', deleteServer, 'ServersService', 'listServers');
  bottle.serviceFactory('listServers', listServers, 'ServersService', 'axios');

  bottle.serviceFactory('resetSelectedServer', () => resetSelectedServer);
};

export default provideServices;
