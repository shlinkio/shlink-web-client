import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import ToggleSwitch from '../utils/ToggleSwitch';
import { Settings } from './reducers/settings';

interface RealTimeUpdatesProps {
  settings: Settings;
  setRealTimeUpdates: (enabled: boolean) => void;
}

const RealTimeUpdates = ({ settings: { realTimeUpdates }, setRealTimeUpdates }: RealTimeUpdatesProps) => (
  <Card>
    <CardHeader>Real-time updates</CardHeader>
    <CardBody>
      <ToggleSwitch checked={realTimeUpdates.enabled} onChange={setRealTimeUpdates}>
        Enable or disable real-time updates, when using Shlink v2.2.0 or newer.
      </ToggleSwitch>
    </CardBody>
  </Card>
);

export default RealTimeUpdates;
