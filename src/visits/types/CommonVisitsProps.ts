import { SelectedServer } from '../../servers/data';
import { Settings } from '../../settings/reducers/settings';

export interface CommonVisitsProps {
  selectedServer: SelectedServer;
  settings: Settings;
}
