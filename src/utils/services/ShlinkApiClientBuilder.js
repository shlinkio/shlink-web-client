import * as axios from 'axios';
import ShlinkApiClient from './ShlinkApiClient';

const apiClients = {};

const buildShlinkApiClient = (axios) => ({ url, apiKey }) => {
  const clientKey = `${url}_${apiKey}`;

  if (!apiClients[clientKey]) {
    apiClients[clientKey] = new ShlinkApiClient(axios, url, apiKey);
  }

  return apiClients[clientKey];
};

export default buildShlinkApiClient;

export const buildShlinkApiClientWithAxios = buildShlinkApiClient(axios);
