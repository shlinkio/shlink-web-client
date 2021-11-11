import { FC, useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { faBars as burgerIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { withSelectedServer } from '../servers/helpers/withSelectedServer';
import { useSwipeable, useToggle } from '../utils/helpers/hooks';
import { supportsDomainRedirects, supportsOrphanVisits } from '../utils/helpers/features';
import { isReachableServer } from '../servers/data';
import NotFound from './NotFound';
import { AsideMenuProps } from './AsideMenu';
import './MenuLayout.scss';

const MenuLayout = (
  TagsList: FC,
  ShortUrlsList: FC,
  AsideMenu: FC<AsideMenuProps>,
  CreateShortUrl: FC,
  ShortUrlVisits: FC,
  TagVisits: FC,
  OrphanVisits: FC,
  ServerError: FC,
  Overview: FC,
  EditShortUrl: FC,
  ManageDomains: FC,
) => withSelectedServer(({ location, selectedServer }) => {
  const [ sidebarVisible, toggleSidebar, showSidebar, hideSidebar ] = useToggle();

  useEffect(() => hideSidebar(), [ location ]);

  if (!isReachableServer(selectedServer)) {
    return <ServerError />;
  }

  const addOrphanVisitsRoute = supportsOrphanVisits(selectedServer);
  const addManageDomainsRoute = supportsDomainRedirects(selectedServer);
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
                <Route exact path="/server/:serverId/list-short-urls/:page" component={ShortUrlsList} />
                <Route exact path="/server/:serverId/create-short-url" component={CreateShortUrl} />
                <Route path="/server/:serverId/short-code/:shortCode/visits" component={ShortUrlVisits} />
                <Route path="/server/:serverId/short-code/:shortCode/edit" component={EditShortUrl} />
                <Route path="/server/:serverId/tag/:tag/visits" component={TagVisits} />
                {addOrphanVisitsRoute && <Route path="/server/:serverId/orphan-visits" component={OrphanVisits} />}
                <Route exact path="/server/:serverId/manage-tags" component={TagsList} />
                {addManageDomainsRoute && <Route exact path="/server/:serverId/manage-domains" component={ManageDomains} />}
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
