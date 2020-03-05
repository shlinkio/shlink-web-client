import React from 'react';
import { serverType } from '../servers/prop-types';

const propTypes = {
  selectedServer: serverType,
};

const ShlinkVersions = ({ selectedServer }) => {
  const { version } = selectedServer;

  return <span>Server: v{version}</span>;
};

ShlinkVersions.propTypes = propTypes;

export default ShlinkVersions;
