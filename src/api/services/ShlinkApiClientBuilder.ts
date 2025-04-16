import type { HttpClient } from '@shlinkio/shlink-js-sdk';
import { ShlinkApiClient } from '@shlinkio/shlink-js-sdk';
import type { GetState } from '../../container/types';
import type { ServerWithId } from '../../servers/data';
import { hasServerData } from '../../servers/data';

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
  const { url: baseUrl, apiKey } = isGetState(getStateOrSelectedServer)
    ? getSelectedServerFromState(getStateOrSelectedServer)
    : getStateOrSelectedServer;
  const serverKey = `${apiKey}_${baseUrl}`;

  const apiClient = apiClients[serverKey] ?? new ShlinkApiClient(httpClient, { apiKey, baseUrl }, { credentials: 'include' });
  apiClients[serverKey] = apiClient;

  return apiClient;
};

export type ShlinkApiClientBuilder = ReturnType<typeof buildShlinkApiClient>;
