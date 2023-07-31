import type { FC, ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { NavPillItem, NavPills } from '../../shlink-frontend-kit/src';
import { NoMenuLayout } from '../common/NoMenuLayout';

const SettingsSections: FC<{ items: ReactNode[] }> = ({ items }) => (
  <>
    {items.map((child, index) => <div key={index} className="mb-3">{child}</div>)}
  </>
);

export const Settings = (
  RealTimeUpdates: FC,
  ShortUrlCreation: FC,
  ShortUrlsList: FC,
  UserInterface: FC,
  Visits: FC,
  Tags: FC,
) => () => (
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
