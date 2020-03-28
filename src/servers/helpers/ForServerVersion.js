import React from 'react';
import PropTypes from 'prop-types';
import { serverType } from '../prop-types';
import { compareVersions } from '../../utils/helpers/version';

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
  const matchesMinVersion = !minVersion || compareVersions(version, '>=', minVersion);
  const matchesMaxVersion = !maxVersion || compareVersions(version, '<=', maxVersion);

  if (!matchesMinVersion || !matchesMaxVersion) {
    return null;
  }

  return <React.Fragment>{children}</React.Fragment>;
};

ForServerVersion.propTypes = propTypes;

export default ForServerVersion;
