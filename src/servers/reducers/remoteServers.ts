import type { HttpClient } from '@shlinkio/shlink-js-sdk';
import pack from '../../../package.json';
import { createAsyncThunk } from '../../utils/helpers/redux';
import type { ServerData } from '../data';
import { hasServerData } from '../data';
import { createServers } from './servers';

const responseToServersList = (data: any): ServerData[] => (Array.isArray(data) ? data.filter(hasServerData) : []);

export const fetchServers = (httpClient: HttpClient) => createAsyncThunk(
  'shlink/remoteServers/fetchServers',
  async (_: void, { dispatch }): Promise<void> => {
    const resp = await httpClient.jsonRequest<any>(`${pack.homepage}/servers.json`);
    const result = responseToServersList(resp);

    dispatch(createServers(result));
  },
);
