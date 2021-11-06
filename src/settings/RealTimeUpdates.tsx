import { FormGroup, Input } from 'reactstrap';
import classNames from 'classnames';
import ToggleSwitch from '../utils/ToggleSwitch';
import { SimpleCard } from '../utils/SimpleCard';
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
  <SimpleCard title="Real-time updates" className="h-100">
    <FormGroup>
      <ToggleSwitch checked={realTimeUpdates.enabled} onChange={toggleRealTimeUpdates}>
        Enable or disable real-time updates.
        <small className="form-text text-muted">
          Real-time updates are currently being <b>{realTimeUpdates.enabled ? 'processed' : 'ignored'}</b>.
        </small>
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
        onChange={({ target }) => setRealTimeUpdatesInterval(Number(target.value))}
      />
      {realTimeUpdates.enabled && (
        <small className="form-text text-muted">
          {realTimeUpdates.interval !== undefined && realTimeUpdates.interval > 0 && (
            <span>
              Updates will be reflected in the UI every <b>{realTimeUpdates.interval}</b> minute{realTimeUpdates.interval > 1 && 's'}.
            </span>
          )}
          {!realTimeUpdates.interval && 'Updates will be reflected in the UI as soon as they happen.'}
        </small>
      )}
    </FormGroup>
  </SimpleCard>
);

export default RealTimeUpdates;
