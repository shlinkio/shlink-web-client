import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { pipe } from 'ramda';
import { serverType } from '../servers/prop-types';
import { versionToPrintable, versionToSemVer } from '../utils/helpers/version';

const SHLINK_WEB_CLIENT_VERSION = '%_VERSION_%';

const propTypes = {
  selectedServer: serverType,
  className: PropTypes.string,
  clientVersion: PropTypes.string,
};

const ShlinkVersions = ({ selectedServer, className, clientVersion = SHLINK_WEB_CLIENT_VERSION }) => {
  const { printableVersion: serverVersion } = selectedServer;
  const normalizedClientVersion = pipe(versionToSemVer(), versionToPrintable)(clientVersion);

  return (
    <small className={classNames('text-muted', className)}>
      Client: <a href="https://github.com/shlinkio/shlink-web-client/releases" rel="noopener noreferrer"><b>{normalizedClientVersion}</b></a> - Server: <a href="https://github.com/shlinkio/shlink/releases" rel="noopener noreferrer"><b>{serverVersion}</b></a>
    </small>
  );
};

ShlinkVersions.propTypes = propTypes;

export default ShlinkVersions;
