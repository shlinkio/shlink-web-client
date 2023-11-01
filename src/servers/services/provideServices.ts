import type Bottle from 'bottlejs';
import type { ConnectDecorator } from '../../container/types';
import { CreateServerFactory } from '../CreateServer';
import { DeleteServerButtonFactory } from '../DeleteServerButton';
import { DeleteServerModal } from '../DeleteServerModal';
import { EditServerFactory } from '../EditServer';
import { ImportServersBtnFactory } from '../helpers/ImportServersBtn';
import { ServerErrorFactory } from '../helpers/ServerError';
import { withoutSelectedServer } from '../helpers/withoutSelectedServer';
import { ManageServersFactory } from '../ManageServers';
import { ManageServersRowFactory } from '../ManageServersRow';
import { ManageServersRowDropdownFactory } from '../ManageServersRowDropdown';
import { fetchServers } from '../reducers/remoteServers';
import {
  resetSelectedServer,
  selectedServerReducerCreator,
  selectServer,
} from '../reducers/selectedServer';
import { createServers, deleteServer, editServer, setAutoConnect } from '../reducers/servers';
import { ServersDropdown } from '../ServersDropdown';
import { ServersExporter } from './ServersExporter';
import { ServersImporter } from './ServersImporter';

export const provideServices = (bottle: Bottle, connect: ConnectDecorator) => {
  // Components
  bottle.factory('ManageServers', ManageServersFactory);
  bottle.decorator('ManageServers', withoutSelectedServer);
  bottle.decorator('ManageServers', connect(['selectedServer', 'servers'], ['resetSelectedServer']));

  bottle.factory('ManageServersRow', ManageServersRowFactory);

  bottle.factory('ManageServersRowDropdown', ManageServersRowDropdownFactory);
  bottle.decorator('ManageServersRowDropdown', connect(null, ['setAutoConnect']));

  bottle.factory('CreateServer', CreateServerFactory);
  bottle.decorator('CreateServer', withoutSelectedServer);
  bottle.decorator('CreateServer', connect(['selectedServer', 'servers'], ['createServers', 'resetSelectedServer']));

  bottle.factory('EditServer', EditServerFactory);
  bottle.decorator('EditServer', connect(['selectedServer'], ['editServer', 'selectServer', 'resetSelectedServer']));

  bottle.serviceFactory('ServersDropdown', () => ServersDropdown);
  bottle.decorator('ServersDropdown', connect(['servers', 'selectedServer']));

  bottle.serviceFactory('DeleteServerModal', () => DeleteServerModal);
  bottle.decorator('DeleteServerModal', connect(null, ['deleteServer']));

  bottle.factory('DeleteServerButton', DeleteServerButtonFactory);

  bottle.factory('ImportServersBtn', ImportServersBtnFactory);
  bottle.decorator('ImportServersBtn', connect(['servers'], ['createServers']));

  bottle.factory('ServerError', ServerErrorFactory);
  bottle.decorator('ServerError', connect(['servers', 'selectedServer']));

  // Services
  bottle.service('ServersImporter', ServersImporter, 'csvToJson');
  bottle.service('ServersExporter', ServersExporter, 'Storage', 'window', 'jsonToCsv');

  // Actions
  bottle.serviceFactory('selectServer', selectServer, 'buildShlinkApiClient', 'loadMercureInfo');
  bottle.serviceFactory('createServers', () => createServers);
  bottle.serviceFactory('deleteServer', () => deleteServer);
  bottle.serviceFactory('editServer', () => editServer);
  bottle.serviceFactory('setAutoConnect', () => setAutoConnect);
  bottle.serviceFactory('fetchServers', fetchServers, 'HttpClient');

  bottle.serviceFactory('resetSelectedServer', () => resetSelectedServer);

  // Reducers
  bottle.serviceFactory('selectedServerReducerCreator', selectedServerReducerCreator, 'selectServer');
  bottle.serviceFactory('selectedServerReducer', (obj) => obj.reducer, 'selectedServerReducerCreator');
};
