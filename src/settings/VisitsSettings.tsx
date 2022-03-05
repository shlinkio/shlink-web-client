import { FC } from 'react';
import { SimpleCard } from '../utils/SimpleCard';
import { DateIntervalSelector } from '../utils/dates/DateIntervalSelector';
import { Settings, VisitsSettings as VisitsSettingsConfig } from './reducers/settings';

interface VisitsProps {
  settings: Settings;
  setVisitsSettings: (settings: VisitsSettingsConfig) => void;
}

export const VisitsSettings: FC<VisitsProps> = ({ settings, setVisitsSettings }) => (
  <SimpleCard title="Visits" className="h-100">
    <label className="form-label">Default interval to load on visits sections:</label>
    <DateIntervalSelector
      allText="All visits"
      active={settings.visits?.defaultInterval ?? 'last30Days'}
      onChange={(defaultInterval) => setVisitsSettings({ defaultInterval })}
    />
  </SimpleCard>
);
