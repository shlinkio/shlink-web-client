import { FormGroup, Input } from 'reactstrap';
import classNames from 'classnames';
import ToggleSwitch from '../utils/ToggleSwitch';
import { SimpleCard } from '../utils/SimpleCard';
import { FormText } from '../utils/forms/FormText';
import { LabeledFormGroup } from '../utils/forms/LabeledFormGroup';
import { Settings } from './reducers/settings';

interface RealTimeUpdatesProps {
  settings: Settings;
  toggleRealTimeUpdates: (enabled: boolean) => void;
  setRealTimeUpdatesInterval: (interval: number) => void;
}

const intervalValue = (interval?: number) => (!interval ? '' : `${interval}`);

const RealTimeUpdatesSettings = (
  { settings: { realTimeUpdates }, toggleRealTimeUpdates, setRealTimeUpdatesInterval }: RealTimeUpdatesProps,
) => (
  <SimpleCard title="Real-time updates" className="h-100">
    <FormGroup>
      <ToggleSwitch checked={realTimeUpdates.enabled} onChange={toggleRealTimeUpdates}>
        Enable or disable real-time updates.
        <FormText>
          Real-time updates are currently being <b>{realTimeUpdates.enabled ? 'processed' : 'ignored'}</b>.
        </FormText>
      </ToggleSwitch>
    </FormGroup>
    <LabeledFormGroup
      noMargin
      label="Real-time updates frequency (in minutes):"
      labelClassName={classNames('form-label', { 'text-muted': !realTimeUpdates.enabled })}
    >
      <Input
        type="number"
        min={0}
        placeholder="Immediate"
        disabled={!realTimeUpdates.enabled}
        value={intervalValue(realTimeUpdates.interval)}
        onChange={({ target }) => setRealTimeUpdatesInterval(Number(target.value))}
      />
      {realTimeUpdates.enabled && (
        <FormText>
          {realTimeUpdates.interval !== undefined && realTimeUpdates.interval > 0 && (
            <span>
              Updates will be reflected in the UI every <b>{realTimeUpdates.interval}</b> minute{realTimeUpdates.interval > 1 && 's'}.
            </span>
          )}
          {!realTimeUpdates.interval && 'Updates will be reflected in the UI as soon as they happen.'}
        </FormText>
      )}
    </LabeledFormGroup>
  </SimpleCard>
);

export default RealTimeUpdatesSettings;
