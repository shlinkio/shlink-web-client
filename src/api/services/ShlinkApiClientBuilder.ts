import type { HttpClient } from '@shlinkio/shlink-js-sdk';
import { ShlinkApiClient } from '@shlinkio/shlink-js-sdk';
import type { GetState } from '../../container/types';
import type { ServerWithId } from '../../servers/data';
import { hasServerData } from '../../servers/data';

const apiClients: Map<string, ShlinkApiClient> = new Map();

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
  const { url: baseUrl, apiKey, forwardCredentials } = isGetState(getStateOrSelectedServer)
    ? getSelectedServerFromState(getStateOrSelectedServer)
    : getStateOrSelectedServer;
  const serverKey = `${apiKey}_${baseUrl}_${forwardCredentials ? 'forward' : 'no-forward'}`;
  const existingApiClient = apiClients.get(serverKey);

  if (existingApiClient) {
    return existingApiClient;
  }

  const apiClient = new ShlinkApiClient(
    httpClient,
    { apiKey, baseUrl },
    { requestCredentials: forwardCredentials ? 'include' : undefined },
  );
  apiClients.set(serverKey, apiClient);
  return apiClient;
};

export type ShlinkApiClientBuilder = ReturnType<typeof buildShlinkApiClient>;
