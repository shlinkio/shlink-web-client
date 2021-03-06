import { FC, useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { faBars as burgerIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { withSelectedServer } from '../servers/helpers/withSelectedServer';
import { useSwipeable, useToggle } from '../utils/helpers/hooks';
import { supportsOrphanVisits, supportsTagVisits } from '../utils/helpers/features';
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
  OrphanVisits: FC,
  ServerError: FC,
  Overview: FC,
) => withSelectedServer(({ location, selectedServer }) => {
  const [ sidebarVisible, toggleSidebar, showSidebar, hideSidebar ] = useToggle();

  useEffect(() => hideSidebar(), [ location ]);

  if (!isReachableServer(selectedServer)) {
    return <ServerError />;
  }

  const addTagsVisitsRoute = supportsTagVisits(selectedServer);
  const addOrphanVisitsRoute = supportsOrphanVisits(selectedServer);
  const burgerClasses = classNames('menu-layout__burger-icon', { 'menu-layout__burger-icon--active': sidebarVisible });
  const swipeableProps = useSwipeable(showSidebar, hideSidebar);

  return (
    <>
      <FontAwesomeIcon icon={burgerIcon} className={burgerClasses} onClick={toggleSidebar} />

      <div {...swipeableProps} className="menu-layout__swipeable">
        <div className="menu-layout__swipeable-inner">
          <AsideMenu selectedServer={selectedServer} showOnMobile={sidebarVisible} />
          <div className="menu-layout__container" onClick={() => hideSidebar()}>
            <div className="container-xl">
              <Switch>
                <Redirect exact from="/server/:serverId" to="/server/:serverId/overview" />
                <Route exact path="/server/:serverId/overview" component={Overview} />
                <Route exact path="/server/:serverId/list-short-urls/:page" component={ShortUrls} />
                <Route exact path="/server/:serverId/create-short-url" component={CreateShortUrl} />
                <Route path="/server/:serverId/short-code/:shortCode/visits" component={ShortUrlVisits} />
                {addTagsVisitsRoute && <Route path="/server/:serverId/tag/:tag/visits" component={TagVisits} />}
                {addOrphanVisitsRoute && <Route path="/server/:serverId/orphan-visits" component={OrphanVisits} />}
                <Route exact path="/server/:serverId/manage-tags" component={TagsList} />
                <Route
                  render={() => <NotFound to={`/server/${selectedServer.id}/list-short-urls/1`}>List short URLs</NotFound>}
                />
              </Switch>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}, ServerError);

export default MenuLayout;
