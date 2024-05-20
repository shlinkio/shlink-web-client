import type Bottle from 'bottlejs';
import type { ConnectDecorator } from '../../container/types';
import { withoutSelectedServer } from '../../servers/helpers/withoutSelectedServer';
import { setSettings } from '../reducers/settings';
import { Settings } from '../Settings';

export const provideServices = (bottle: Bottle, connect: ConnectDecorator) => {
  // Components
  bottle.serviceFactory('Settings', () => Settings);
  bottle.decorator('Settings', withoutSelectedServer);
  bottle.decorator('Settings', connect(['settings'], ['setSettings', 'resetSelectedServer']));

  // Actions
  bottle.serviceFactory('setSettings', () => setSettings);
};
