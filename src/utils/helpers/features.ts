import { isReachableServer, SelectedServer } from '../../servers/data';
import { versionMatch, Versions } from './version';

const serverMatchesVersions = (versions: Versions) => (selectedServer: SelectedServer): boolean =>
  isReachableServer(selectedServer) && versionMatch(selectedServer.version, versions);

export const titleIsSupported = serverMatchesVersions({ minVersion: '2.6.0' });
