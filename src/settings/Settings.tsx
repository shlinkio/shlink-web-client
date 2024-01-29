import { NavPillItem, NavPills } from '@shlinkio/shlink-frontend-kit';
import type { FC, ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { NoMenuLayout } from '../common/NoMenuLayout';
import type { FCWithDeps } from '../container/utils';
import { componentFactory, useDependencies } from '../container/utils';

type SettingsDeps = {
  RealTimeUpdatesSettings: FC;
  ShortUrlCreationSettings: FC;
  ShortUrlsListSettings: FC;
  UserInterfaceSettings: FC;
  VisitsSettings: FC;
  TagsSettings: FC;
};

const SettingsSections: FC<{ items: ReactNode[] }> = ({ items }) => (
  <>
    {items.map((child, index) => <div key={index} className="mb-3">{child}</div>)}
  </>
);

const Settings: FCWithDeps<{}, SettingsDeps> = () => {
  const {
    RealTimeUpdatesSettings: RealTimeUpdates,
    ShortUrlCreationSettings: ShortUrlCreation,
    ShortUrlsListSettings: ShortUrlsList,
    UserInterfaceSettings: UserInterface,
    VisitsSettings: Visits,
    TagsSettings: Tags,
  } = useDependencies(Settings);

  return (
    <NoMenuLayout>
      <NavPills className="mb-3">
        <NavPillItem to="general">General</NavPillItem>
        <NavPillItem to="short-urls">Short URLs</NavPillItem>
        <NavPillItem to="other-items">Other items</NavPillItem>
      </NavPills>

      <Routes>
        <Route path="general" element={<SettingsSections items={[<UserInterface />, <RealTimeUpdates />]} />} />
        <Route path="short-urls" element={<SettingsSections items={[<ShortUrlCreation />, <ShortUrlsList />]} />} />
        <Route path="other-items" element={<SettingsSections items={[<Tags />, <Visits />]} />} />
        <Route path="*" element={<Navigate replace to="general" />} />
      </Routes>
    </NoMenuLayout>
  );
};

export const SettingsFactory = componentFactory(Settings, [
  'RealTimeUpdatesSettings',
  'ShortUrlCreationSettings',
  'ShortUrlsListSettings',
  'UserInterfaceSettings',
  'VisitsSettings',
  'TagsSettings',
]);
