import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Theme } from '@shlinkio/shlink-frontend-kit';
import { changeThemeInMarkup, SimpleCard, ToggleSwitch } from '@shlinkio/shlink-frontend-kit';
import type { FC } from 'react';
import type { AppSettings, UiSettings } from './reducers/settings';
import './UserInterfaceSettings.scss';

interface UserInterfaceProps {
  settings: AppSettings;
  setUiSettings: (settings: UiSettings) => void;
}

export const UserInterfaceSettings: FC<UserInterfaceProps> = ({ settings: { ui }, setUiSettings }) => (
  <SimpleCard title="User interface" className="h-100">
    <FontAwesomeIcon icon={ui?.theme === 'dark' ? faMoon : faSun} className="user-interface__theme-icon" />
    <ToggleSwitch
      checked={ui?.theme === 'dark'}
      onChange={(useDarkTheme) => {
        const theme: Theme = useDarkTheme ? 'dark' : 'light';

        setUiSettings({ ...ui, theme });
        changeThemeInMarkup(theme);
      }}
    >
      Use dark theme.
    </ToggleSwitch>
  </SimpleCard>
);
