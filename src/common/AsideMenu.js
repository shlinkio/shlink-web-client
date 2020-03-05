import { faList as listIcon, faLink as createIcon, faTags as tagsIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { serverType } from '../servers/prop-types';
import './AsideMenu.scss';

const AsideMenuItem = ({ children, to, ...rest }) => (
  <NavLink className="aside-menu__item" activeClassName="aside-menu__item--selected" to={to} {...rest}>
    {children}
  </NavLink>
);

AsideMenuItem.propTypes = {
  children: PropTypes.node.isRequired,
  to: PropTypes.string.isRequired,
};

const propTypes = {
  selectedServer: serverType,
  className: PropTypes.string,
  showOnMobile: PropTypes.bool,
};

const AsideMenu = (DeleteServerButton) => {
  const AsideMenu = ({ selectedServer, className, showOnMobile }) => {
    const serverId = selectedServer ? selectedServer.id : '';
    const asideClass = classNames('aside-menu', className, {
      'aside-menu--hidden': !showOnMobile,
    });
    const shortUrlsIsActive = (match, location) => location.pathname.match('/list-short-urls');
    const buildPath = (suffix) => `/server/${serverId}${suffix}`;

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

          <DeleteServerButton className="aside-menu__item aside-menu__item--danger" server={selectedServer} />
        </nav>
      </aside>
    );
  };

  AsideMenu.propTypes = propTypes;

  return AsideMenu;
};

export default AsideMenu;
