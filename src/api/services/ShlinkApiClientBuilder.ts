import { hasServerData, ServerWithId } from '../../servers/data';
import { GetState } from '../../container/types';
import { ShlinkApiClient } from './ShlinkApiClient';
import { JsonFetch } from '../../utils/types';

const apiClients: Record<string, ShlinkApiClient> = {};

const isGetState = (getStateOrSelectedServer: GetState | ServerWithId): getStateOrSelectedServer is GetState =>
  typeof getStateOrSelectedServer === 'function';
const getSelectedServerFromState = (getState: GetState): ServerWithId => {
  const { selectedServer } = getState();
  if (!hasServerData(selectedServer)) {
    throw new Error('There\'s no selected server or it is not found');
  }

  return selectedServer;
};

export const buildShlinkApiClient = (fetch: JsonFetch) => (getStateOrSelectedServer: GetState | ServerWithId) => {
  const { url, apiKey } = isGetState(getStateOrSelectedServer)
    ? getSelectedServerFromState(getStateOrSelectedServer)
    : getStateOrSelectedServer;
  const clientKey = `${url}_${apiKey}`;

  if (!apiClients[clientKey]) {
    apiClients[clientKey] = new ShlinkApiClient(fetch, url, apiKey);
  }

  return apiClients[clientKey];
};

export type ShlinkApiClientBuilder = ReturnType<typeof buildShlinkApiClient>;
