import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'ramda';
import { compareVersions } from './utils';

const propTypes = {
  minVersion: PropTypes.string.isRequired,
  currentServerVersion: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const ForVersion = ({ minVersion, currentServerVersion, children }) =>
  isEmpty(currentServerVersion) || compareVersions(currentServerVersion, '<', minVersion)
    ? null
    : <React.Fragment>{children}</React.Fragment>;

ForVersion.propTypes = propTypes;

export default ForVersion;
