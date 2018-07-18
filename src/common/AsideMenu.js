import React from 'react';
import { NavLink } from 'react-router-dom';
import './AsideMenu.scss';

export default function AsideMenu({ selectedServer }) {
  const serverId = selectedServer ? selectedServer.id : '';

  return (
    <aside className="aside-menu col-md-2 col-sm-2">
      <nav className="nav flex-column aside-menu__nav">
        <NavLink
          className="aside-menu__item"
          activeClassName="aside-menu__item--selected"
          to={`/server/${serverId}/list-short-urls/1`}
          isActive={match => match && match.params.serverId === serverId}
        >
          List short URLs
        </NavLink>
        <NavLink
          className="aside-menu__item"
          activeClassName="aside-menu__item--selected"
          to={`/server/${serverId}/create-short-url`}
        >
          Create short code
        </NavLink>
        <span className="aside-menu__item--divider" />
        <span className="aside-menu__item aside-menu__item--danger">Delete this server</span>
      </nav>
    </aside>
  );
}
