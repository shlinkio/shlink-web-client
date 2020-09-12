import React from 'react';
import { Card, CardBody, CardHeader, FormGroup, Input } from 'reactstrap';
import classNames from 'classnames';
import ToggleSwitch from '../utils/ToggleSwitch';
import { Settings } from './reducers/settings';

interface RealTimeUpdatesProps {
  settings: Settings;
  toggleRealTimeUpdates: (enabled: boolean) => void;
  setRealTimeUpdatesInterval: (interval: number) => void;
}

const intervalValue = (interval?: number) => !interval ? '' : `${interval}`;

const RealTimeUpdates = (
  { settings: { realTimeUpdates }, toggleRealTimeUpdates, setRealTimeUpdatesInterval }: RealTimeUpdatesProps,
) => (
  <Card>
    <CardHeader>Real-time updates</CardHeader>
    <CardBody>
      <FormGroup>
        <ToggleSwitch checked={realTimeUpdates.enabled} onChange={toggleRealTimeUpdates}>
          Enable or disable real-time updates, when using Shlink v2.2.0 or newer.
        </ToggleSwitch>
      </FormGroup>
      <FormGroup className="mb-0">
        <label className={classNames({ 'text-muted': !realTimeUpdates.enabled })}>
          Real-time updates frequency (in minutes):
        </label>
        <Input
          type="number"
          min={0}
          placeholder="Immediate"
          disabled={!realTimeUpdates.enabled}
          value={intervalValue(realTimeUpdates.interval)}
          onChange={(e) => setRealTimeUpdatesInterval(Number(e.target.value))}
        />
        {realTimeUpdates.enabled && (
          <small className="form-text text-muted">
            {realTimeUpdates.interval !== undefined && realTimeUpdates.interval > 0 &&
              <span>Updates will be reflected in the UI every <b>{realTimeUpdates.interval}</b> minutes.</span>
            }
            {!realTimeUpdates.interval && 'Updates will be reflected in the UI as soon as they happen.'}
          </small>
        )}
      </FormGroup>
    </CardBody>
  </Card>
);

export default RealTimeUpdates;
