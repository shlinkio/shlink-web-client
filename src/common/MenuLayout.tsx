import { FC, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { faBars as burgerIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { withSelectedServer } from '../servers/helpers/withSelectedServer';
import { useSwipeable, useToggle } from '../utils/helpers/hooks';
import { supportsDomainVisits, supportsNonOrphanVisits } from '../utils/helpers/features';
import { isReachableServer } from '../servers/data';
import { NotFound } from './NotFound';
import { AsideMenuProps } from './AsideMenu';
import './MenuLayout.scss';

interface MenuLayoutProps {
  sidebarPresent: Function;
  sidebarNotPresent: Function;
}

export const MenuLayout = (
  TagsList: FC,
  ShortUrlsList: FC,
  AsideMenu: FC<AsideMenuProps>,
  CreateShortUrl: FC,
  ShortUrlVisits: FC,
  TagVisits: FC,
  DomainVisits: FC,
  OrphanVisits: FC,
  NonOrphanVisits: FC,
  ServerError: FC,
  Overview: FC,
  EditShortUrl: FC,
  ManageDomains: FC,
) => withSelectedServer<MenuLayoutProps>(({ selectedServer, sidebarNotPresent, sidebarPresent }) => {
  const location = useLocation();
  const [sidebarVisible, toggleSidebar, showSidebar, hideSidebar] = useToggle();
  const showContent = isReachableServer(selectedServer);

  useEffect(() => hideSidebar(), [location]);
  useEffect(() => {
    showContent && sidebarPresent();
    return () => sidebarNotPresent();
  }, []);

  if (!showContent) {
    return <ServerError />;
  }

  const addNonOrphanVisitsRoute = supportsNonOrphanVisits(selectedServer);
  const addDomainVisitsRoute = supportsDomainVisits(selectedServer);
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
              <Routes>
                <Route index element={<Navigate replace to="overview" />} />
                <Route path="/overview" element={<Overview />} />
                <Route path="/list-short-urls/:page" element={<ShortUrlsList />} />
                <Route path="/create-short-url" element={<CreateShortUrl />} />
                <Route path="/short-code/:shortCode/visits/*" element={<ShortUrlVisits />} />
                <Route path="/short-code/:shortCode/edit" element={<EditShortUrl />} />
                <Route path="/tag/:tag/visits/*" element={<TagVisits />} />
                {addDomainVisitsRoute && <Route path="/domain/:domain/visits/*" element={<DomainVisits />} />}
                <Route path="/orphan-visits/*" element={<OrphanVisits />} />
                {addNonOrphanVisitsRoute && <Route path="/non-orphan-visits/*" element={<NonOrphanVisits />} />}
                <Route path="/manage-tags" element={<TagsList />} />
                <Route path="/manage-domains" element={<ManageDomains />} />
                <Route
                  path="*"
                  element={<NotFound to={`/server/${selectedServer.id}/list-short-urls/1`}>List short URLs</NotFound>}
                />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}, ServerError);
