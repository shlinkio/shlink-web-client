import type { ServerWithId } from '../../servers/data';
import { hasServerData } from '../../servers/data';
import type { GetState } from '../../container/types';
import { ShlinkApiClient } from './ShlinkApiClient';
import type { HttpClient } from '../../common/services/HttpClient';

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

export const buildShlinkApiClient = (httpClient: HttpClient) => (getStateOrSelectedServer: GetState | ServerWithId) => {
  const { url, apiKey } = isGetState(getStateOrSelectedServer)
    ? getSelectedServerFromState(getStateOrSelectedServer)
    : getStateOrSelectedServer;
  const clientKey = `${url}_${apiKey}`;

  if (!apiClients[clientKey]) {
    apiClients[clientKey] = new ShlinkApiClient(httpClient, url, apiKey);
  }

  return apiClients[clientKey];
};

export type ShlinkApiClientBuilder = ReturnType<typeof buildShlinkApiClient>;
