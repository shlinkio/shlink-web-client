import { FC, PropsWithChildren } from 'react';
import { versionMatch, Versions } from '../../utils/helpers/version';
import { isReachableServer, SelectedServer } from '../data';

export type ForServerVersionProps = PropsWithChildren<Versions>;

interface ForServerVersionConnectProps extends ForServerVersionProps {
  selectedServer: SelectedServer;
}

const ForServerVersion: FC<ForServerVersionConnectProps> = ({ minVersion, maxVersion, selectedServer, children }) => {
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
