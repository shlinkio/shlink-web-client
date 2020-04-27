import { pipe, prop } from 'ramda';
import { homepage } from '../../../package.json';
import { createServers } from './servers';

const responseToServersList = pipe(
  prop('data'),
  (value) => {
    if (!Array.isArray(value)) {
      throw new Error('Value is not an array');
    }

    return value;
  },
);

export const fetchServers = ({ get }) => () => async (dispatch) => {
  const remoteList = await get(`${homepage}/servers.json`)
    .then(responseToServersList)
    .catch(() => []);

  dispatch(createServers(remoteList));
};
