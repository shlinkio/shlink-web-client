import type { Settings as AppSettings } from '@shlinkio/shlink-web-component/settings';
import { ShlinkWebSettings } from '@shlinkio/shlink-web-component/settings';
import type { FC } from 'react';
import { NoMenuLayout } from '../common/NoMenuLayout';
import { DEFAULT_SHORT_URLS_ORDERING } from './reducers/settings';

export type SettingsProps = {
  settings: AppSettings;
  setSettings: (newSettings: AppSettings) => void;
};

export const Settings: FC<SettingsProps> = ({ settings, setSettings }) => (
  <NoMenuLayout>
    <ShlinkWebSettings
      settings={settings}
      onUpdateSettings={setSettings}
      defaultShortUrlsListOrdering={DEFAULT_SHORT_URLS_ORDERING}
    />
  </NoMenuLayout>
);
