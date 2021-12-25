import { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { FormGroup } from 'reactstrap';
import { SimpleCard } from '../utils/SimpleCard';
import ToggleSwitch from '../utils/ToggleSwitch';
import { changeThemeInMarkup, Theme } from '../utils/theme';
import { Settings, UiSettings } from './reducers/settings';
import './UserInterfaceSettings.scss';

interface UserInterfaceProps {
  settings: Settings;
  setUiSettings: (settings: UiSettings) => void;
}

export const UserInterfaceSettings: FC<UserInterfaceProps> = ({ settings: { ui }, setUiSettings }) => (
  <SimpleCard title="User interface" className="h-100">
    <FormGroup>
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
    </FormGroup>
  </SimpleCard>
);
