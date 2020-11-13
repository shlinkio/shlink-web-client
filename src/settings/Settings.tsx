import { FC } from 'react';
import NoMenuLayout from '../common/NoMenuLayout';

const Settings = (RealTimeUpdates: FC) => () => (
  <NoMenuLayout>
    <RealTimeUpdates />
  </NoMenuLayout>
);

export default Settings;
