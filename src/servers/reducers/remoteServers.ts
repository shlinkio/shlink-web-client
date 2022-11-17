import pack from '../../../package.json';
import { hasServerData, ServerData } from '../data';
import { createServers } from './servers';
import { createAsyncThunk } from '../../utils/helpers/redux';
import { HttpClient } from '../../common/services/HttpClient';

const responseToServersList = (data: any): ServerData[] => (Array.isArray(data) ? data.filter(hasServerData) : []);

export const fetchServers = (httpClient: HttpClient) => createAsyncThunk(
  'shlink/remoteServers/fetchServers',
  async (_: void, { dispatch }): Promise<void> => {
    const resp = await httpClient.fetchJson<any>(`${pack.homepage}/servers.json`);
    const result = responseToServersList(resp);

    dispatch(createServers(result));
  },
);
