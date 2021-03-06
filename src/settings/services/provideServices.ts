import Bottle from 'bottlejs';
import RealTimeUpdates from '../RealTimeUpdates';
import Settings from '../Settings';
import {
  setRealTimeUpdatesInterval,
  setShortUrlCreationSettings,
  setUiSettings,
  setVisitsSettings,
  toggleRealTimeUpdates,
} from '../reducers/settings';
import { ConnectDecorator } from '../../container/types';
import { withoutSelectedServer } from '../../servers/helpers/withoutSelectedServer';
import { ShortUrlCreation } from '../ShortUrlCreation';
import { UserInterface } from '../UserInterface';
import { Visits } from '../Visits';

const provideServices = (bottle: Bottle, connect: ConnectDecorator) => {
  // Components
  bottle.serviceFactory('Settings', Settings, 'RealTimeUpdates', 'ShortUrlCreation', 'UserInterface', 'Visits');
  bottle.decorator('Settings', withoutSelectedServer);
  bottle.decorator('Settings', connect(null, [ 'resetSelectedServer' ]));

  bottle.serviceFactory('RealTimeUpdates', () => RealTimeUpdates);
  bottle.decorator(
    'RealTimeUpdates',
    connect([ 'settings' ], [ 'toggleRealTimeUpdates', 'setRealTimeUpdatesInterval' ]),
  );

  bottle.serviceFactory('ShortUrlCreation', () => ShortUrlCreation);
  bottle.decorator('ShortUrlCreation', connect([ 'settings' ], [ 'setShortUrlCreationSettings' ]));

  bottle.serviceFactory('UserInterface', () => UserInterface);
  bottle.decorator('UserInterface', connect([ 'settings' ], [ 'setUiSettings' ]));

  bottle.serviceFactory('Visits', () => Visits);
  bottle.decorator('Visits', connect([ 'settings' ], [ 'setVisitsSettings' ]));

  // Actions
  bottle.serviceFactory('toggleRealTimeUpdates', () => toggleRealTimeUpdates);
  bottle.serviceFactory('setRealTimeUpdatesInterval', () => setRealTimeUpdatesInterval);
  bottle.serviceFactory('setShortUrlCreationSettings', () => setShortUrlCreationSettings);
  bottle.serviceFactory('setUiSettings', () => setUiSettings);
  bottle.serviceFactory('setVisitsSettings', () => setVisitsSettings);
};

export default provideServices;
