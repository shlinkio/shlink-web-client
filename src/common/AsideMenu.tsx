import {
  faList as listIcon,
  faLink as createIcon,
  faTags as tagsIcon,
  faPen as editIcon,
  faHome as overviewIcon,
  faGlobe as domainsIcon,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { FC } from 'react';
import type { NavLinkProps } from 'react-router-dom';
import { NavLink, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import type { DeleteServerButtonProps } from '../servers/DeleteServerButton';
import type { SelectedServer } from '../servers/data';
import { isServerWithId } from '../servers/data';
import './AsideMenu.scss';

export interface AsideMenuProps {
  selectedServer: SelectedServer;
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

export const AsideMenu = (DeleteServerButton: FC<DeleteServerButtonProps>) => (
  { selectedServer, showOnMobile = false }: AsideMenuProps,
) => {
  const hasId = isServerWithId(selectedServer);
  const serverId = hasId ? selectedServer.id : '';
  const { pathname } = useLocation();
  const asideClass = classNames('aside-menu', {
    'aside-menu--hidden': !showOnMobile,
  });
  const buildPath = (suffix: string) => `/server/${serverId}${suffix}`;

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
        <AsideMenuItem to={buildPath('/edit')} className="aside-menu__item--push">
          <FontAwesomeIcon fixedWidth icon={editIcon} />
          <span className="aside-menu__item-text">Edit this server</span>
        </AsideMenuItem>
        {hasId && (
          <DeleteServerButton
            className="aside-menu__item aside-menu__item--danger"
            textClassName="aside-menu__item-text"
            server={selectedServer}
          />
        )}
      </nav>
    </aside>
  );
};
