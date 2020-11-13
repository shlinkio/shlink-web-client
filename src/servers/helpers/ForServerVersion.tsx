import { FC } from 'react';
import { versionMatch, Versions } from '../../utils/helpers/version';
import { isReachableServer, SelectedServer } from '../data';

interface ForServerVersionProps extends Versions {
  selectedServer: SelectedServer;
}

const ForServerVersion: FC<ForServerVersionProps> = ({ minVersion, maxVersion, selectedServer, children }) => {
  if (!isReachableServer(selectedServer)) {
    return null;
  }

  const { version } = selectedServer;
  const matchesVersion = versionMatch(version, { maxVersion, minVersion });

  if (!matchesVersion) {
    return null;
  }

  return <>{children}</>;
};

export default ForServerVersion;
