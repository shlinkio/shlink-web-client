import React, { FC, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { EventData, Swipeable } from 'react-swipeable';
import { faBars as burgerIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { withSelectedServer } from '../servers/helpers/withSelectedServer';
import { useToggle } from '../utils/helpers/hooks';
import { versionMatch } from '../utils/helpers/version';
import { isReachableServer } from '../servers/data';
import NotFound from './NotFound';
import { AsideMenuProps } from './AsideMenu';
import './MenuLayout.scss';

const MenuLayout = (
  TagsList: FC,
  ShortUrls: FC,
  AsideMenu: FC<AsideMenuProps>,
  CreateShortUrl: FC,
  ShortUrlVisits: FC,
  TagVisits: FC,
  ServerError: FC,
) => withSelectedServer(({ location, selectedServer }) => {
  const [ sidebarVisible, toggleSidebar, showSidebar, hideSidebar ] = useToggle();

  useEffect(() => hideSidebar(), [ location ]);

  if (!isReachableServer(selectedServer)) {
    return <ServerError />;
  }

  const addTagsVisitsRoute = versionMatch(selectedServer.version, { minVersion: '2.2.0' });
  const burgerClasses = classNames('menu-layout__burger-icon', {
    'menu-layout__burger-icon--active': sidebarVisible,
  });
  const swipeMenuIfNoModalExists = (callback: () => void) => (e: EventData) => {
    const swippedOnVisitsTable = (e.event.composedPath() as HTMLElement[]).some(
      ({ classList }) => classList?.contains('visits-table'),
    );

    if (swippedOnVisitsTable || document.querySelector('.modal')) {
      return;
    }

    callback();
  };

  return (
    <React.Fragment>
      <FontAwesomeIcon icon={burgerIcon} className={burgerClasses} onClick={toggleSidebar} />

      <Swipeable
        delta={40}
        className="menu-layout__swipeable"
        onSwipedLeft={swipeMenuIfNoModalExists(hideSidebar)}
        onSwipedRight={swipeMenuIfNoModalExists(showSidebar)}
      >
        <div className="row menu-layout__swipeable-inner">
          <AsideMenu className="col-lg-2 col-md-3" selectedServer={selectedServer} showOnMobile={sidebarVisible} />
          <div className="col-lg-10 offset-lg-2 col-md-9 offset-md-3" onClick={() => hideSidebar()}>
            <div className="menu-layout__container">
              <Switch>
                <Route exact path="/server/:serverId/list-short-urls/:page" component={ShortUrls} />
                <Route exact path="/server/:serverId/create-short-url" component={CreateShortUrl} />
                <Route exact path="/server/:serverId/short-code/:shortCode/visits" component={ShortUrlVisits} />
                {addTagsVisitsRoute && <Route exact path="/server/:serverId/tag/:tag/visits" component={TagVisits} />}
                <Route exact path="/server/:serverId/manage-tags" component={TagsList} />
                <Route
                  render={() => <NotFound to={`/server/${selectedServer.id}/list-short-urls/1`}>List short URLs</NotFound>}
                />
              </Switch>
            </div>
          </div>
        </div>
      </Swipeable>
    </React.Fragment>
  );
}, ServerError);

export default MenuLayout;
