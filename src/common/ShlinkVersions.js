import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { pipe } from 'ramda';
import { serverType } from '../servers/prop-types';
import { versionToPrintable, versionToSemVer } from '../utils/helpers/version';
import { ExternalLink } from 'react-external-link';

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
      Client: {<ExternalLink href="https://github.com/shlinkio/shlink-web-client/releases/" className="text-muted"><b>{normalizedClientVersion}</b></ExternalLink>} - Server: {<ExternalLink href="https://github.com/shlinkio/shlink/releases/" className="text-muted"><b>{serverVersion}</b></ExternalLink>}
    </small>
  );
};

ShlinkVersions.propTypes = propTypes;

export default ShlinkVersions;
