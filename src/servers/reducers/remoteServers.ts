import pack from '../../../package.json';
import { hasServerData, ServerData } from '../data';
import { createServers } from './servers';
import { createAsyncThunk } from '../../utils/helpers/redux';
import { JsonFetch } from '../../utils/types';

const responseToServersList = (data: any): ServerData[] => (Array.isArray(data) ? data.filter(hasServerData) : []);

export const fetchServers = (fetch: JsonFetch) => createAsyncThunk(
  'shlink/remoteServers/fetchServers',
  async (_: void, { dispatch }): Promise<void> => {
    const resp = await fetch<any>(`${pack.homepage}/servers.json`);
    const result = responseToServersList(resp);

    dispatch(createServers(result));
  },
);
