import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { pipe } from 'ramda';
import { ExternalLink } from 'react-external-link';
import { serverType } from '../servers/prop-types';
import { versionToPrintable, versionToSemVer } from '../utils/helpers/version';

const SHLINK_WEB_CLIENT_VERSION = '%_VERSION_%';
const normalizeVersion = pipe(versionToSemVer(), versionToPrintable);

const propTypes = {
  selectedServer: serverType,
  className: PropTypes.string,
  clientVersion: PropTypes.string,
};

const versionLinkPropTypes = {
  project: PropTypes.oneOf([ 'shlink', 'shlink-web-client' ]).isRequired,
  version: PropTypes.string.isRequired,
};

const VersionLink = ({ project, version }) => (
  <ExternalLink href={`https://github.com/shlinkio/${project}/releases/${version}`} className="text-muted">
    <b>{version}</b>
  </ExternalLink>
);

VersionLink.propTypes = versionLinkPropTypes;

const ShlinkVersions = ({ selectedServer, className, clientVersion = SHLINK_WEB_CLIENT_VERSION }) => {
  const { printableVersion: serverVersion } = selectedServer;
  const normalizedClientVersion = normalizeVersion(clientVersion);

  return (
    <small className={classNames('text-muted', className)}>
      Client: <VersionLink project="shlink-web-client" version={normalizedClientVersion} /> -
      Server: <VersionLink project="shlink" version={serverVersion} />
    </small>
  );
};

ShlinkVersions.propTypes = propTypes;

export default ShlinkVersions;
