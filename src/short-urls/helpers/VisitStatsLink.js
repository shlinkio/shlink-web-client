import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { serverType } from '../../servers/prop-types';
import { shortUrlType } from '../reducers/shortUrlsList';

const propTypes = {
  shortUrl: shortUrlType,
  selectedServer: serverType,
  children: PropTypes.node.isRequired,
};

const buildVisitsUrl = ({ id }, { shortCode, domain }) => {
  const query = domain ? `?domain=${domain}` : '';

  return `/server/${id}/short-code/${shortCode}/visits${query}`;
};

const VisitStatsLink = ({ selectedServer, shortUrl, children, ...rest }) => {
  if (!selectedServer || !shortUrl) {
    return <span {...rest}>{children}</span>;
  }

  return <Link to={buildVisitsUrl(selectedServer, shortUrl)} {...rest}>{children}</Link>;
};

VisitStatsLink.propTypes = propTypes;

export default VisitStatsLink;
