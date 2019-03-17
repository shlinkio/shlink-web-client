import { createAction, handleActions } from 'redux-actions';
import { pipe } from 'ramda';

export const FETCH_SERVERS = 'shlink/servers/FETCH_SERVERS';

export const listServers = ({ listServers }) => createAction(FETCH_SERVERS, () => listServers());

export const createServer = ({ createServer }, listServers) => pipe(createServer, listServers);

export const deleteServer = ({ deleteServer }, listServers) => pipe(deleteServer, listServers);

export const createServers = ({ createServers }, listServers) => pipe(createServers, listServers);

export default handleActions({
  [FETCH_SERVERS]: (state, { payload }) => payload,
}, {});
