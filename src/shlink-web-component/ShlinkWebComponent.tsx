import { faBars as burgerIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Store } from '@reduxjs/toolkit';
import classNames from 'classnames';
import type { FC } from 'react';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AsideMenu } from '../common/AsideMenu';
import { NotFound } from '../common/NotFound';
import { useSwipeable, useToggle } from '../utils/helpers/hooks';
import type { SemVer } from '../utils/helpers/version';
import { FeaturesProvider, useFeatures } from './utils/features';
import type { Settings } from './utils/settings';
import { SettingsProvider } from './utils/settings';

type ShlinkWebComponentProps = {
  routesPrefix?: string;
  serverVersion: SemVer;
  settings?: Settings;
};

export const ShlinkWebComponent = (
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
  store: Store,
): FC<ShlinkWebComponentProps> => ({ routesPrefix = '', serverVersion, settings }) => {
  const location = useLocation();
  const [sidebarVisible, toggleSidebar, showSidebar, hideSidebar] = useToggle();
  useEffect(() => hideSidebar(), [location]);

  const features = useFeatures(serverVersion);
  const addNonOrphanVisitsRoute = features.nonOrphanVisits;
  const addDomainVisitsRoute = features.domainVisits;
  const burgerClasses = classNames('menu-layout__burger-icon', { 'menu-layout__burger-icon--active': sidebarVisible });
  const swipeableProps = useSwipeable(showSidebar, hideSidebar);

  // TODO Check if this is already wrapped by a router, and wrap otherwise

  return (
    <Provider store={store}>
      <SettingsProvider value={settings}>
        <FeaturesProvider value={features}>
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
                    {addNonOrphanVisitsRoute && <Route path="/non-orphan-visits/*" element={<NonOrphanVisits />} />}
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
        </FeaturesProvider>
      </SettingsProvider>
    </Provider>
  );
};

export type ShlinkWebComponentType = ReturnType<typeof ShlinkWebComponent>;
