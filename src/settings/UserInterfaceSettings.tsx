import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { FC } from 'react';
import { SimpleCard, ToggleSwitch } from '../../shlink-frontend-kit/src';
import type { Settings } from '../../shlink-web-component';
import type { Theme } from '../utils/theme';
import { changeThemeInMarkup } from '../utils/theme';
import type { Defined } from '../utils/types';
import './UserInterfaceSettings.scss';

type UiSettings = Defined<Settings['ui']>;

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
