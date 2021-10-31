import { pipe, prop } from 'ramda';
import { AxiosInstance } from 'axios';
import { Dispatch } from 'redux';
import { homepage } from '../../../package.json';
import { hasServerData, ServerData } from '../data';
import { createServers } from './servers';

const responseToServersList = pipe(
  prop<any, any>('data'),
  (data: any): ServerData[] => Array.isArray(data) ? data.filter(hasServerData) : [],
);

export const fetchServers = ({ get }: AxiosInstance) => () => async (dispatch: Dispatch) => {
  const resp = await get(`${homepage}/servers.json`);
  const remoteList = responseToServersList(resp);

  dispatch(createServers(remoteList));
};
