import { handleActions } from 'redux-actions';
import { pipe, isEmpty, assoc, map, prop } from 'ramda';
import { v4 as uuid } from 'uuid';
import { homepage } from '../../../package.json';

export const LIST_SERVERS = 'shlink/servers/LIST_SERVERS';

const initialState = {};

const assocId = (server) => assoc('id', server.id || uuid(), server);

export default handleActions({
  [LIST_SERVERS]: (state, { list }) => list,
}, initialState);

export const listServers = ({ listServers, createServers }, { get }) => () => async (dispatch) => {
  const localList = listServers();

  if (!isEmpty(localList)) {
    dispatch({ type: LIST_SERVERS, list: localList });

    return;
  }

  // If local list is empty, try to fetch it remotely (making sure it's an array) and calculate IDs for every server
  const getDataAsArrayWithIds = pipe(
    prop('data'),
    (value) => {
      if (!Array.isArray(value)) {
        throw new Error('Value is not an array');
      }

      return value;
    },
    map(assocId),
  );
  const remoteList = await get(`${homepage}/servers.json`)
    .then(getDataAsArrayWithIds)
    .catch(() => []);

  createServers(remoteList);
  dispatch({ type: LIST_SERVERS, list: remoteList.reduce((map, server) => ({ ...map, [server.id]: server }), {}) });
};

export const createServer = ({ createServer }, listServersAction) => pipe(createServer, listServersAction);

export const editServer = ({ editServer }, listServersAction) => pipe(editServer, listServersAction);

export const deleteServer = ({ deleteServer }, listServersAction) => pipe(deleteServer, listServersAction);

export const createServers = ({ createServers }, listServersAction) => pipe(
  map(assocId),
  createServers,
  listServersAction
);
