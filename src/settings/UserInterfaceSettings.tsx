import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Theme } from '@shlinkio/shlink-frontend-kit';
import { getSystemPreferredTheme, SimpleCard, ToggleSwitch } from '@shlinkio/shlink-frontend-kit';
import type { FC } from 'react';
import { useMemo } from 'react';
import type { AppSettings, UiSettings } from './reducers/settings';
import './UserInterfaceSettings.scss';

interface UserInterfaceProps {
  settings: AppSettings;
  setUiSettings: (settings: UiSettings) => void;

  /* Test seam */
  _matchMedia?: typeof window.matchMedia;
}

export const UserInterfaceSettings: FC<UserInterfaceProps> = ({ settings: { ui }, setUiSettings, _matchMedia }) => {
  const currentTheme = useMemo(() => ui?.theme ?? getSystemPreferredTheme(_matchMedia), [ui?.theme, _matchMedia]);
  return (
    <SimpleCard title="User interface" className="h-100">
      <FontAwesomeIcon icon={currentTheme === 'dark' ? faMoon : faSun} className="user-interface__theme-icon" />
      <ToggleSwitch
        checked={currentTheme === 'dark'}
        onChange={(useDarkTheme) => {
          const theme: Theme = useDarkTheme ? 'dark' : 'light';
          setUiSettings({ ...ui, theme });
        }}
      >
        Use dark theme.
      </ToggleSwitch>
    </SimpleCard>
  );
};
