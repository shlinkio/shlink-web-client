import { LabeledFormGroup, SimpleCard, ToggleSwitch } from '@shlinkio/shlink-frontend-kit';
import type { Settings, VisitsSettings as VisitsSettingsConfig } from '@shlinkio/shlink-web-component';
import type { FC } from 'react';
import { useCallback } from 'react';
import { FormGroup } from 'reactstrap';
import type { DateInterval } from '../utils/dates/DateIntervalSelector';
import { DateIntervalSelector } from '../utils/dates/DateIntervalSelector';
import { FormText } from '../utils/forms/FormText';

type VisitsProps = {
  settings: Settings;
  setVisitsSettings: (settings: VisitsSettingsConfig) => void;
};

const currentDefaultInterval = (settings: Settings): DateInterval => settings.visits?.defaultInterval ?? 'last30Days';

export const VisitsSettings: FC<VisitsProps> = ({ settings, setVisitsSettings }) => {
  const updateSettings = useCallback(
    ({ defaultInterval, ...rest }: Partial<VisitsSettingsConfig>) => setVisitsSettings(
      { defaultInterval: defaultInterval ?? currentDefaultInterval(settings), ...rest },
    ),
    [setVisitsSettings, settings],
  );

  return (
    <SimpleCard title="Visits" className="h-100">
      <FormGroup>
        <ToggleSwitch
          checked={!!settings.visits?.excludeBots}
          onChange={(excludeBots) => updateSettings({ excludeBots })}
        >
          Exclude bots wherever possible (this option&lsquo;s effect might depend on Shlink server&lsquo;s version).
          <FormText>
            The visits coming from potential bots will
            be <b>{settings.visits?.excludeBots ? 'excluded' : 'included'}</b>.
          </FormText>
        </ToggleSwitch>
      </FormGroup>
      <FormGroup>
        <ToggleSwitch
          checked={!!settings.visits?.loadPrevInterval}
          onChange={(loadPrevInterval) => updateSettings({ loadPrevInterval })}
        >
          Compare visits with previous period.
          <FormText>
            When loading visits, previous period <b>{settings.visits?.loadPrevInterval ? 'will' : 'won\'t'}</b> be
            loaded by default.
          </FormText>
        </ToggleSwitch>
      </FormGroup>
      <LabeledFormGroup noMargin label="Default interval to load on visits sections:">
        <DateIntervalSelector
          allText="All visits"
          active={currentDefaultInterval(settings)}
          onChange={(defaultInterval) => updateSettings({ defaultInterval })}
        />
      </LabeledFormGroup>
    </SimpleCard>
  );
};
