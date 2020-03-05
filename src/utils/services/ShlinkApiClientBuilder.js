import ShlinkApiClient from './ShlinkApiClient';

const apiClients = {};

const getSelectedServerFromState = (getState) => {
  const { selectedServer } = getState();

  return selectedServer;
};

const buildShlinkApiClient = (axios) => async (getStateOrSelectedServer) => {
  const { url, apiKey } = typeof getStateOrSelectedServer === 'function'
    ? getSelectedServerFromState(getStateOrSelectedServer)
    : getStateOrSelectedServer;
  const clientKey = `${url}_${apiKey}`;

  if (!apiClients[clientKey]) {
    apiClients[clientKey] = new ShlinkApiClient(axios, url, apiKey);
  }

  return apiClients[clientKey];
};

export default buildShlinkApiClient;
