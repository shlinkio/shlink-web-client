import {
  faGlobe as domainsIcon,
  faHome as overviewIcon,
  faLink as createIcon,
  faList as listIcon,
  faTags as tagsIcon,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import type { FC } from 'react';
import type { NavLinkProps } from 'react-router-dom';
import { NavLink, useLocation } from 'react-router-dom';
import './AsideMenu.scss';

export interface AsideMenuProps {
  routePrefix: string;
  showOnMobile?: boolean;
}

interface AsideMenuItemProps extends NavLinkProps {
  to: string;
  className?: string;
}

const AsideMenuItem: FC<AsideMenuItemProps> = ({ children, to, className, ...rest }) => (
  <NavLink
    className={({ isActive }) => classNames('aside-menu__item', className, { 'aside-menu__item--selected': isActive })}
    to={to}
    {...rest}
  >
    {children}
  </NavLink>
);

export const AsideMenu: FC<AsideMenuProps> = ({ routePrefix, showOnMobile = false }) => {
  const { pathname } = useLocation();
  const asideClass = classNames('aside-menu', {
    'aside-menu--hidden': !showOnMobile,
  });
  const buildPath = (suffix: string) => `${routePrefix}${suffix}`;

  return (
    <aside className={asideClass}>
      <nav className="nav flex-column aside-menu__nav">
        <AsideMenuItem to={buildPath('/overview')}>
          <FontAwesomeIcon fixedWidth icon={overviewIcon} />
          <span className="aside-menu__item-text">Overview</span>
        </AsideMenuItem>
        <AsideMenuItem
          to={buildPath('/list-short-urls/1')}
          className={classNames({ 'aside-menu__item--selected': pathname.match('/list-short-urls') !== null })}
        >
          <FontAwesomeIcon fixedWidth icon={listIcon} />
          <span className="aside-menu__item-text">List short URLs</span>
        </AsideMenuItem>
        <AsideMenuItem to={buildPath('/create-short-url')}>
          <FontAwesomeIcon fixedWidth icon={createIcon} flip="horizontal" />
          <span className="aside-menu__item-text">Create short URL</span>
        </AsideMenuItem>
        <AsideMenuItem to={buildPath('/manage-tags')}>
          <FontAwesomeIcon fixedWidth icon={tagsIcon} />
          <span className="aside-menu__item-text">Manage tags</span>
        </AsideMenuItem>
        <AsideMenuItem to={buildPath('/manage-domains')}>
          <FontAwesomeIcon fixedWidth icon={domainsIcon} />
          <span className="aside-menu__item-text">Manage domains</span>
        </AsideMenuItem>
      </nav>
    </aside>
  );
};
