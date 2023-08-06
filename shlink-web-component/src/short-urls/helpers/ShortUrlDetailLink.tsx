import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { useRoutesPrefix } from '../../utils/routesPrefix';
import type { ShlinkShortUrl } from '../data';
import { urlEncodeShortCode } from './index';

export type LinkSuffix = 'visits' | 'edit';

export interface ShortUrlDetailLinkProps {
  shortUrl?: ShlinkShortUrl | null;
  suffix: LinkSuffix;
  asLink?: boolean;
}

const buildUrl = (routePrefix: string, { shortCode, domain }: ShlinkShortUrl, suffix: LinkSuffix) => {
  const query = domain ? `?domain=${domain}` : '';
  return `${routePrefix}/short-code/${urlEncodeShortCode(shortCode)}/${suffix}${query}`;
};

export const ShortUrlDetailLink: FC<ShortUrlDetailLinkProps & Record<string | number, any>> = (
  { shortUrl, suffix, asLink, children, ...rest },
) => {
  const routePrefix = useRoutesPrefix();
  if (!asLink || !shortUrl) {
    return <span {...rest}>{children}</span>;
  }

  return <Link to={buildUrl(routePrefix, shortUrl, suffix)} {...rest}>{children}</Link>;
};
