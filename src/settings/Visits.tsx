import { FormGroup } from 'reactstrap';
import { FC } from 'react';
import { SimpleCard } from '../utils/SimpleCard';
import { DateIntervalSelector } from '../utils/dates/DateIntervalSelector';
import { Settings, VisitsSettings } from './reducers/settings';

interface VisitsProps {
  settings: Settings;
  setVisitsSettings: (settings: VisitsSettings) => void;
}

export const Visits: FC<VisitsProps> = ({ settings, setVisitsSettings }) => (
  <SimpleCard title="Visits">
    <FormGroup className="mb-0">
      <label>Default interval to load on visits sections:</label>
      <DateIntervalSelector
        active={settings.visits?.defaultInterval ?? 'last30Days'}
        onChange={(defaultInterval) => setVisitsSettings({ defaultInterval })}
      />
    </FormGroup>
  </SimpleCard>
);
