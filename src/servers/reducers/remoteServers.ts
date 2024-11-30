import type { HttpClient } from '@shlinkio/shlink-js-sdk';
import pack from '../../../package.json';
import { createAsyncThunk } from '../../utils/helpers/redux';
import { hasServerData } from '../data';
import { ensureUniqueIds } from '../helpers';
import { createServers } from './servers';

const responseToServersList = (data: any) => ensureUniqueIds(
  {},
  (Array.isArray(data) ? data.filter(hasServerData) : []),
);

export const fetchServers = (httpClient: HttpClient) => createAsyncThunk(
  'shlink/remoteServers/fetchServers',
  async (_: void, { dispatch }): Promise<void> => {
    const resp = await httpClient.jsonRequest<any>(`${pack.homepage}/servers.json`);
    const result = responseToServersList(resp);

    dispatch(createServers(result));
  },
);
