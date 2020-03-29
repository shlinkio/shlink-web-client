import React from 'react';
import PropTypes from 'prop-types';
import { serverType } from '../prop-types';
import { versionMatch } from '../../utils/helpers/version';

const propTypes = {
  minVersion: PropTypes.string,
  maxVersion: PropTypes.string,
  selectedServer: serverType,
  children: PropTypes.node.isRequired,
};

const ForServerVersion = ({ minVersion, maxVersion, selectedServer, children }) => {
  if (!selectedServer) {
    return null;
  }

  const { version } = selectedServer;
  const matchesVersion = versionMatch(version, { maxVersion, minVersion });

  if (!matchesVersion) {
    return null;
  }

  return <React.Fragment>{children}</React.Fragment>;
};

ForServerVersion.propTypes = propTypes;

export default ForServerVersion;
