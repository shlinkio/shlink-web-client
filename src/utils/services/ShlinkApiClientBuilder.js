import { wait } from '../utils';
import ShlinkApiClient from './ShlinkApiClient';

const apiClients = {};

const getSelectedServerFromState = async (getState) => {
  const { selectedServer } = getState();

  if (!selectedServer) {
    return wait(250).then(() => getSelectedServerFromState(getState));
  }

  return selectedServer;
};

const buildShlinkApiClient = (axios) => async (getState) => {
  const { url, apiKey } = await getSelectedServerFromState(getState);
  const clientKey = `${url}_${apiKey}`;

  if (!apiClients[clientKey]) {
    apiClients[clientKey] = new ShlinkApiClient(axios, url, apiKey);
  }

  return apiClients[clientKey];
};

export default buildShlinkApiClient;
