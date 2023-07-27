import { faBars as burgerIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import type { FC } from 'react';
import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { NotFound } from '../src/common/NotFound';
import { AsideMenu } from './common/AsideMenu';
import { useFeature } from './utils/features';
import { useSwipeable, useToggle } from './utils/helpers/hooks';
import { useRoutesPrefix } from './utils/routesPrefix';

export const Main = (
  TagsList: FC,
  ShortUrlsList: FC,
  CreateShortUrl: FC,
  ShortUrlVisits: FC,
  TagVisits: FC,
  DomainVisits: FC,
  OrphanVisits: FC,
  NonOrphanVisits: FC,
  Overview: FC,
  EditShortUrl: FC,
  ManageDomains: FC,
): FC => () => {
  const location = useLocation();
  const routesPrefix = useRoutesPrefix();
  const [sidebarVisible, toggleSidebar, showSidebar, hideSidebar] = useToggle();
  useEffect(() => hideSidebar(), [location]);

  const addDomainVisitsRoute = useFeature('domainVisits');
  const burgerClasses = classNames('menu-layout__burger-icon', { 'menu-layout__burger-icon--active': sidebarVisible });
  const swipeableProps = useSwipeable(showSidebar, hideSidebar);

  // FIXME Check if this is already wrapped by a router, and wrap otherwise

  return (
    <>
      <FontAwesomeIcon icon={burgerIcon} className={burgerClasses} onClick={toggleSidebar} />

      <div {...swipeableProps} className="menu-layout__swipeable">
        <div className="menu-layout__swipeable-inner">
          <AsideMenu routePrefix={routesPrefix} showOnMobile={sidebarVisible} />
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
                <Route path="/non-orphan-visits/*" element={<NonOrphanVisits />} />
                <Route path="/manage-tags" element={<TagsList />} />
                <Route path="/manage-domains" element={<ManageDomains />} />
                <Route
                  path="*"
                  element={<NotFound to={`${routesPrefix}/list-short-urls/1`}>List short URLs</NotFound>}
                />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
