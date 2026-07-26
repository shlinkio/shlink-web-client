import type { HttpClient } from '@shlinkio/shlink-js-sdk';
import { ShlinkApiClient } from '@shlinkio/shlink-js-sdk';
import type { ServerWithId } from '../../servers/data';
import { hasServerData } from '../../servers/data';
import type { GetState } from '../../store';

const apiClients: Map<string, ShlinkApiClient> = new Map();

const getSelectedServerFromState = (getState: GetState): ServerWithId => {
  const { selectedServer } = getState();
  if (!hasServerData(selectedServer)) {
    throw new Error("There's no selected server or it is not found");
  }

  return selectedServer;
};

export const buildShlinkApiClient = (httpClient: HttpClient) => (getStateOrSelectedServer: GetState | ServerWithId) => {
  const {
    url: baseUrl,
    apiKey,
    forwardCredentials,
  } = typeof getStateOrSelectedServer === 'function'
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
