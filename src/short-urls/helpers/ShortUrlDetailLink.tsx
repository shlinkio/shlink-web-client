import { FC } from 'react';
import { Link } from 'react-router-dom';
import { isServerWithId, SelectedServer, ServerWithId } from '../../servers/data';
import { ShortUrl } from '../data';

export type LinkSuffix = 'visits' | 'edit';

export interface ShortUrlDetailLinkProps {
  shortUrl?: ShortUrl | null;
  selectedServer?: SelectedServer;
  suffix: LinkSuffix;
}

const buildUrl = ({ id }: ServerWithId, { shortCode, domain }: ShortUrl, suffix: LinkSuffix) => {
  const query = domain ? `?domain=${domain}` : '';
  return `/server/${id}/short-code/${shortCode}/${suffix}${query}`;
};

export const ShortUrlDetailLink: FC<ShortUrlDetailLinkProps & Record<string | number, any>> = (
  { selectedServer, shortUrl, suffix, children, ...rest },
) => {
  if (!selectedServer || !isServerWithId(selectedServer) || !shortUrl) {
    return <span {...rest}>{children}</span>;
  }

  return <Link to={buildUrl(selectedServer, shortUrl, suffix)} {...rest}>{children}</Link>;
};
