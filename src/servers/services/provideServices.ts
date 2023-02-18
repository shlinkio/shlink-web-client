import type Bottle from 'bottlejs';
import { prop } from 'ramda';
import type { ConnectDecorator } from '../../container/types';
import { CreateServer } from '../CreateServer';
import { DeleteServerButton } from '../DeleteServerButton';
import { DeleteServerModal } from '../DeleteServerModal';
import { EditServer } from '../EditServer';
import { ImportServersBtn } from '../helpers/ImportServersBtn';
import { ServerError } from '../helpers/ServerError';
import { withoutSelectedServer } from '../helpers/withoutSelectedServer';
import { ManageServers } from '../ManageServers';
import { ManageServersRow } from '../ManageServersRow';
import { ManageServersRowDropdown } from '../ManageServersRowDropdown';
import { Overview } from '../Overview';
import { fetchServers } from '../reducers/remoteServers';
import {
  resetSelectedServer,
  selectedServerReducerCreator,
  selectServer,
  selectServerListener,
} from '../reducers/selectedServer';
import { createServers, deleteServer, editServer, setAutoConnect } from '../reducers/servers';
import { ServersDropdown } from '../ServersDropdown';
import { ServersExporter } from './ServersExporter';
import { ServersImporter } from './ServersImporter';

export const provideServices = (bottle: Bottle, connect: ConnectDecorator) => {
  // Components
  bottle.serviceFactory(
    'ManageServers',
    ManageServers,
    'ServersExporter',
    'ImportServersBtn',
    'useTimeoutToggle',
    'ManageServersRow',
  );
  bottle.decorator('ManageServers', withoutSelectedServer);
  bottle.decorator('ManageServers', connect(['selectedServer', 'servers'], ['resetSelectedServer']));

  bottle.serviceFactory('ManageServersRow', ManageServersRow, 'ManageServersRowDropdown');

  bottle.serviceFactory('ManageServersRowDropdown', ManageServersRowDropdown, 'DeleteServerModal');
  bottle.decorator('ManageServersRowDropdown', connect(null, ['setAutoConnect']));

  bottle.serviceFactory('CreateServer', CreateServer, 'ImportServersBtn', 'useTimeoutToggle');
  bottle.decorator('CreateServer', withoutSelectedServer);
  bottle.decorator('CreateServer', connect(['selectedServer', 'servers'], ['createServers', 'resetSelectedServer']));

  bottle.serviceFactory('EditServer', EditServer, 'ServerError');
  bottle.decorator('EditServer', connect(['selectedServer'], ['editServer', 'selectServer', 'resetSelectedServer']));

  bottle.serviceFactory('ServersDropdown', () => ServersDropdown);
  bottle.decorator('ServersDropdown', connect(['servers', 'selectedServer']));

  bottle.serviceFactory('DeleteServerModal', () => DeleteServerModal);
  bottle.decorator('DeleteServerModal', connect(null, ['deleteServer']));

  bottle.serviceFactory('DeleteServerButton', DeleteServerButton, 'DeleteServerModal');

  bottle.serviceFactory('ImportServersBtn', ImportServersBtn, 'ServersImporter');
  bottle.decorator('ImportServersBtn', connect(['servers'], ['createServers']));

  bottle.serviceFactory('ServerError', ServerError, 'DeleteServerButton');
  bottle.decorator('ServerError', connect(['servers', 'selectedServer']));

  bottle.serviceFactory('Overview', Overview, 'ShortUrlsTable', 'CreateShortUrl');
  bottle.decorator('Overview', connect(
    ['shortUrlsList', 'tagsList', 'selectedServer', 'mercureInfo', 'visitsOverview'],
    ['listShortUrls', 'listTags', 'createNewVisits', 'loadMercureInfo', 'loadVisitsOverview'],
  ));

  // Services
  bottle.constant('fileReaderFactory', () => new FileReader());
  bottle.service('ServersImporter', ServersImporter, 'csvToJson', 'fileReaderFactory');
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
  bottle.serviceFactory('selectServerListener', selectServerListener, 'selectServer', 'loadMercureInfo');
  bottle.serviceFactory('selectedServerReducerCreator', selectedServerReducerCreator, 'selectServer');
  bottle.serviceFactory('selectedServerReducer', prop('reducer'), 'selectedServerReducerCreator');
};
