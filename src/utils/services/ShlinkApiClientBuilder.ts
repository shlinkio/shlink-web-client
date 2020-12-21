import { AxiosInstance } from 'axios';
import { prop } from 'ramda';
import { hasServerData, SelectedServer, ServerWithId } from '../../servers/data';
import { GetState } from '../../container/types';
import ShlinkApiClient from './ShlinkApiClient';

// TODO Move this file to api module

const apiClients: Record<string, ShlinkApiClient> = {};

const isGetState = (getStateOrSelectedServer: GetState | ServerWithId): getStateOrSelectedServer is GetState =>
  typeof getStateOrSelectedServer === 'function';
const getSelectedServerFromState = (getState: GetState): SelectedServer => prop('selectedServer', getState());

export type ShlinkApiClientBuilder = (getStateOrSelectedServer: GetState | ServerWithId) => ShlinkApiClient;

const buildShlinkApiClient = (axios: AxiosInstance): ShlinkApiClientBuilder => (
  getStateOrSelectedServer: GetState | ServerWithId,
) => {
  const server = isGetState(getStateOrSelectedServer)
    ? getSelectedServerFromState(getStateOrSelectedServer)
    : getStateOrSelectedServer;

  if (!hasServerData(server)) {
    throw new Error('There\'s no selected server or it is not found');
  }

  const { url, apiKey } = server;
  const clientKey = `${url}_${apiKey}`;

  if (!apiClients[clientKey]) {
    apiClients[clientKey] = new ShlinkApiClient(axios, url, apiKey);
  }

  return apiClients[clientKey];
};

export default buildShlinkApiClient;
