import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { FC } from 'react';
import { SimpleCard } from '../utils/SimpleCard';
import type { Theme } from '../utils/theme';
import { changeThemeInMarkup } from '../utils/theme';
import { ToggleSwitch } from '../utils/ToggleSwitch';
import type { Settings, UiSettings } from './reducers/settings';
import './UserInterfaceSettings.scss';

interface UserInterfaceProps {
  settings: Settings;
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
