import { pipe } from 'ramda';
import { ExternalLink } from 'react-external-link';
import { versionToPrintable, versionToSemVer } from '../utils/helpers/version';
import type { SelectedServer } from '../servers/data';
import { isReachableServer } from '../servers/data';

const SHLINK_WEB_CLIENT_VERSION = '%_VERSION_%';
const normalizeVersion = pipe(versionToSemVer(), versionToPrintable);

export interface ShlinkVersionsProps {
  selectedServer: SelectedServer;
  clientVersion?: string;
}

const VersionLink = ({ project, version }: { project: 'shlink' | 'shlink-web-client'; version: string }) => (
  <ExternalLink href={`https://github.com/shlinkio/${project}/releases/${version}`} className="text-muted">
    <b>{version}</b>
  </ExternalLink>
);

export const ShlinkVersions = ({ selectedServer, clientVersion = SHLINK_WEB_CLIENT_VERSION }: ShlinkVersionsProps) => {
  const normalizedClientVersion = normalizeVersion(clientVersion);

  return (
    <small className="text-muted">
      {isReachableServer(selectedServer) && (
        <>Server: <VersionLink project="shlink" version={selectedServer.printableVersion} /> - </>
      )}
      Client: <VersionLink project="shlink-web-client" version={normalizedClientVersion} />
    </small>
  );
};
