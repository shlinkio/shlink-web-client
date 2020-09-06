import React from 'react';
import classNames from 'classnames';
import { pipe } from 'ramda';
import { ExternalLink } from 'react-external-link';
import { versionToPrintable, versionToSemVer } from '../utils/helpers/version';
import { isReachableServer, SelectedServer } from '../servers/data';

const SHLINK_WEB_CLIENT_VERSION = '%_VERSION_%';
const normalizeVersion = pipe(versionToSemVer(), versionToPrintable);

export interface ShlinkVersionsProps {
  selectedServer: SelectedServer;
  clientVersion?: string;
  className?: string;
}

interface VersionLinkProps {
  project: 'shlink' | 'shlink-web-client';
  version: string;
}

const VersionLink = ({ project, version }: VersionLinkProps) => (
  <ExternalLink href={`https://github.com/shlinkio/${project}/releases/${version}`} className="text-muted">
    <b>{version}</b>
  </ExternalLink>
);

const ShlinkVersions = (
  { selectedServer, className, clientVersion = SHLINK_WEB_CLIENT_VERSION }: ShlinkVersionsProps,
) => {
  const normalizedClientVersion = normalizeVersion(clientVersion);

  return (
    <small className={classNames('text-muted', className)}>
      {isReachableServer(selectedServer) &&
        <React.Fragment>Server: <VersionLink project="shlink" version={selectedServer.printableVersion} /> - </React.Fragment>
      }
      Client: <VersionLink project="shlink-web-client" version={normalizedClientVersion} />
    </small>
  );
};

export default ShlinkVersions;
