import listIcon from '@fortawesome/fontawesome-free-solid/faList';
import createIcon from '@fortawesome/fontawesome-free-solid/faLink';
import tagsIcon from '@fortawesome/fontawesome-free-solid/faTags';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import React from 'react';
import { NavLink } from 'react-router-dom';
import DeleteServerButton from '../servers/DeleteServerButton';
import './AsideMenu.scss';
import PropTypes from 'prop-types';
import { serverType } from '../servers/prop-types';
import classnames from 'classnames';

const defaultProps = {
  className: '',
  showOnMobile: false,
};
const propTypes = {
  selectedServer: serverType,
  className: PropTypes.string,
  showOnMobile: PropTypes.bool,
};

export default function AsideMenu({ selectedServer, className, showOnMobile }) {
  const serverId = selectedServer ? selectedServer.id : '';
  const asideClass = classnames('aside-menu', className, {
    'aside-menu--hidden': !showOnMobile,
  });

  return (
    <aside className={asideClass}>
      <nav className="nav flex-column aside-menu__nav">
        <NavLink
          className="aside-menu__item"
          activeClassName="aside-menu__item--selected"
          to={`/server/${serverId}/list-short-urls/1`}
        >
          <FontAwesomeIcon icon={listIcon} />
          <span className="aside-menu__item-text">List short URLs</span>
        </NavLink>
        <NavLink
          className="aside-menu__item"
          activeClassName="aside-menu__item--selected"
          to={`/server/${serverId}/create-short-url`}
        >
          <FontAwesomeIcon icon={createIcon} flip="horizontal" />
          <span className="aside-menu__item-text">Create short URL</span>
        </NavLink>

        <NavLink
          className="aside-menu__item"
          activeClassName="aside-menu__item--selected"
          to={`/server/${serverId}/tags`}
        >
          <FontAwesomeIcon icon={tagsIcon} />
          <span className="aside-menu__item-text">Manage tags</span>
        </NavLink>

        <DeleteServerButton
          className="aside-menu__item aside-menu__item--danger"
          server={selectedServer}
        />
      </nav>
    </aside>
  );
}

AsideMenu.defaultProps = defaultProps;
AsideMenu.propTypes = propTypes;
