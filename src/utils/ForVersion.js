import React from 'react';
import PropTypes from 'prop-types';
import { compare } from 'compare-versions';
import { isEmpty } from 'ramda';

const propTypes = {
  minVersion: PropTypes.string.isRequired,
  currentServerVersion: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const ForVersion = ({ minVersion, currentServerVersion, children }) =>
  isEmpty(currentServerVersion) || compare(minVersion, currentServerVersion, '>')
    ? null
    : <React.Fragment>{children}</React.Fragment>;

ForVersion.propTypes = propTypes;

export default ForVersion;
