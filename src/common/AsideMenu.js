import listIcon from '@fortawesome/fontawesome-free-solid/faBars';
import createIcon from '@fortawesome/fontawesome-free-solid/faPlus';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import React from 'react';
import { NavLink } from 'react-router-dom';
import DeleteServerButton from '../servers/DeleteServerButton';
import './AsideMenu.scss';

export default function AsideMenu({ selectedServer, history }) {
  const serverId = selectedServer ? selectedServer.id : '';
  const isListShortUrlsActive = (match, { pathname }) => {
    // FIXME. Should use the 'match' params, but they are not being properly resolved. Investigate
    const serverIdFromPathname = pathname.split('/')[2];
    return serverIdFromPathname === serverId && pathname.indexOf('list-short-urls') !== -1;
  };

  return (
    <aside className="aside-menu col-md-2 col-sm-2">
      <nav className="nav flex-column aside-menu__nav">
        <NavLink
          className="aside-menu__item"
          activeClassName="aside-menu__item--selected"
          to={`/server/${serverId}/list-short-urls/1`}
          isActive={isListShortUrlsActive}
        >
          <FontAwesomeIcon icon={listIcon} />
          <span className="aside-menu__item-text">List short URLs</span>
        </NavLink>
        <NavLink
          className="aside-menu__item"
          activeClassName="aside-menu__item--selected"
          to={`/server/${serverId}/create-short-url`}
        >
          <FontAwesomeIcon icon={createIcon} />
          <span className="aside-menu__item-text">Create short URL</span>
        </NavLink>

        <DeleteServerButton
          className="aside-menu__item aside-menu__item--danger"
          history={history}
          server={selectedServer}
        />
      </nav>
    </aside>
  );
}
