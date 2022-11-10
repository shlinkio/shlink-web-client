import { pipe, prop } from 'ramda';
import { AxiosInstance } from 'axios';
import pack from '../../../package.json';
import { hasServerData, ServerData } from '../data';
import { createServers } from './servers';
import { createAsyncThunk } from '../../utils/helpers/redux';

const responseToServersList = pipe(
  prop<any, any>('data'),
  (data: any): ServerData[] => (Array.isArray(data) ? data.filter(hasServerData) : []),
);

export const fetchServers = ({ get }: AxiosInstance) => createAsyncThunk(
  'shlink/remoteServers/fetchServers',
  async (_: void, { dispatch }): Promise<void> => {
    const resp = await get(`${pack.homepage}/servers.json`);
    const result = responseToServersList(resp);

    dispatch(createServers(result));
  },
);
