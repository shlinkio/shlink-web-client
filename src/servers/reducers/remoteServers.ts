import { pipe, prop } from 'ramda';
import { AxiosInstance } from 'axios';
import { Dispatch } from 'redux';
import { homepage } from '../../../package.json';
import { ServerData } from '../data';
import { createServers } from './servers';

const responseToServersList = pipe(
  prop<any, any>('data'),
  (data: any): ServerData[] => {
    if (!Array.isArray(data)) {
      throw new Error('Value is not an array');
    }

    return data as ServerData[];
  },
);

export const fetchServers = ({ get }: AxiosInstance) => () => async (dispatch: Dispatch) => {
  const remoteList = await get(`${homepage}/servers.json`)
    .then(responseToServersList)
    .catch(() => []);

  dispatch(createServers(remoteList));
};
