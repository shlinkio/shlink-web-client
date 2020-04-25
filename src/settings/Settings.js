import React from 'react';
import NoMenuLayout from '../common/NoMenuLayout';

const Settings = (RealTimeUpdates) => () => (
  <NoMenuLayout>
    <RealTimeUpdates />
  </NoMenuLayout>
);

export default Settings;
