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
  const { printableVersion: serverVersion } = <ExternalLink className="text-muted" href="https://github.com/shlinkio/shlink/releases/"><b>selectedServer</b></ExternalLink>;
  const normalizedClientVersion = <ExternalLink className="text-muted" href="https://github.com/shlinkio/shlink/releases/"><b>pipe(versionToSemVer(), versionToPrintable)(clientVersion)</b></ExternalLink>;

  return (
    <small className={classNames('text-muted', className)}>
      Client: {normalizedClientVersion} - Server: {serverVersion}
    </small>
  );
};

ShlinkVersions.propTypes = propTypes;

export default ShlinkVersions;
