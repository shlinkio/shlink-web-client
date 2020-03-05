import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { serverType } from '../servers/prop-types';

const propTypes = {
  selectedServer: serverType,
  className: PropTypes.string,
};

const ShlinkVersions = ({ selectedServer, className }) => {
  const { printableVersion } = selectedServer;

  return <small className={classNames('text-muted', className)}>Client: v2.3.1 / Server: {printableVersion}</small>;
};

ShlinkVersions.propTypes = propTypes;

export default ShlinkVersions;
