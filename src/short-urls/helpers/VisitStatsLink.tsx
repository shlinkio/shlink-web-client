import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { isServerWithId, SelectedServer, ServerWithId } from '../../servers/data';
import { ShortUrl } from '../data';

export interface VisitStatsLinkProps {
  shortUrl?: ShortUrl | null;
  selectedServer?: SelectedServer;
}

const buildVisitsUrl = ({ id }: ServerWithId, { shortCode, domain }: ShortUrl) => {
  const query = domain ? `?domain=${domain}` : '';

  return `/server/${id}/short-code/${shortCode}/visits${query}`;
};

const VisitStatsLink: FC<VisitStatsLinkProps & Record<string | number, any>> = (
  { selectedServer, shortUrl, children, ...rest },
) => {
  if (!selectedServer || !isServerWithId(selectedServer) || !shortUrl) {
    return <span {...rest}>{children}</span>;
  }

  return <Link to={buildVisitsUrl(selectedServer, shortUrl)} {...rest}>{children}</Link>;
};

export default VisitStatsLink;
