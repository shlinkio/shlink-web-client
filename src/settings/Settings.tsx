import { FC, ReactNode } from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import { NoMenuLayout } from '../common/NoMenuLayout';
import { NavPillItem, NavPills } from '../utils/NavPills';

const SettingsSections: FC<{ items: ReactNode[] }> = ({ items }) => (
  <>
    {items.map((child, index) => <div key={index} className="mb-3">{child}</div>)}
  </>
);

const Settings = (
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
      <NavPillItem to="secondary-items">Secondary items</NavPillItem>
    </NavPills>

    <Routes>
      <Route path="general" element={<SettingsSections items={[ <UserInterface key="one" />, <RealTimeUpdates key="two" /> ]} />} />
      <Route path="short-urls" element={<SettingsSections items={[ <ShortUrlCreation key="one" />, <ShortUrlsList key="two" /> ]} />} />
      <Route path="secondary-items" element={<SettingsSections items={[ <Tags key="one" />, <Visits key="two" /> ]} />} />
      <Route path="*" element={<Navigate replace to="general" />} />
    </Routes>
  </NoMenuLayout>
);

export default Settings;
