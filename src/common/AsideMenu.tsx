import {
  faList as listIcon,
  faLink as createIcon,
  faTags as tagsIcon,
  faPen as editIcon,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { FC } from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';
import classNames from 'classnames';
import { Location } from 'history';
import { DeleteServerButtonProps } from '../servers/DeleteServerButton';
import { ServerWithId } from '../servers/data';
import './AsideMenu.scss';

export interface AsideMenuProps {
  selectedServer: ServerWithId;
  className?: string;
  showOnMobile?: boolean;
}

interface AsideMenuItemProps extends NavLinkProps {
  to: string;
  className?: string;
}

const AsideMenuItem: FC<AsideMenuItemProps> = ({ children, to, className, ...rest }) => (
  <NavLink
    className={classNames('aside-menu__item', className)}
    activeClassName="aside-menu__item--selected"
    to={to}
    {...rest}
  >
    {children}
  </NavLink>
);

const AsideMenu = (DeleteServerButton: FC<DeleteServerButtonProps>) => (
  { selectedServer, className, showOnMobile = false }: AsideMenuProps,
) => {
  const serverId = selectedServer ? selectedServer.id : '';
  const asideClass = classNames('aside-menu', className, {
    'aside-menu--hidden': !showOnMobile,
  });
  const shortUrlsIsActive = (_: null, location: Location) => location.pathname.match('/list-short-urls') !== null;
  const buildPath = (suffix: string) => `/server/${serverId}${suffix}`;

  return (
    <aside className={asideClass}>
      <nav className="nav flex-column aside-menu__nav">
        <AsideMenuItem to={buildPath('/list-short-urls/1')} isActive={shortUrlsIsActive}>
          <FontAwesomeIcon icon={listIcon} />
          <span className="aside-menu__item-text">List short URLs</span>
        </AsideMenuItem>
        <AsideMenuItem to={buildPath('/create-short-url')}>
          <FontAwesomeIcon icon={createIcon} flip="horizontal" />
          <span className="aside-menu__item-text">Create short URL</span>
        </AsideMenuItem>
        <AsideMenuItem to={buildPath('/manage-tags')}>
          <FontAwesomeIcon icon={tagsIcon} />
          <span className="aside-menu__item-text">Manage tags</span>
        </AsideMenuItem>
        <AsideMenuItem to={buildPath('/edit')} className="aside-menu__item--push">
          <FontAwesomeIcon icon={editIcon} />
          <span className="aside-menu__item-text">Edit this server</span>
        </AsideMenuItem>
        <DeleteServerButton
          className="aside-menu__item aside-menu__item--danger"
          textClassName="aside-menu__item-text"
          server={selectedServer}
        />
      </nav>
    </aside>
  );
};

export default AsideMenu;
