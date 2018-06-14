import ServersService from '../services';

const LOAD_SERVER = 'shlink/LOAD_SERVER';

export default function selectedServerReducer(state = null, action) {
  switch (action.type) {
    case LOAD_SERVER:
      return action.selectedServer;
  }

  return state;
}

export const loadServer = serverId => {
  return {
    type: LOAD_SERVER,
    selectedServer: ServersService.findServerById(serverId),
  };
};
