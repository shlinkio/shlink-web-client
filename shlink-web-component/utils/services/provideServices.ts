import type Bottle from 'bottlejs';
import { useTimeoutToggle } from '../helpers/hooks';
import { ColorGenerator } from './ColorGenerator';
import { LocalStorage } from './LocalStorage';

export function provideServices(bottle: Bottle) {
  bottle.constant('localStorage', window.localStorage);
  bottle.service('Storage', LocalStorage, 'localStorage');
  bottle.service('ColorGenerator', ColorGenerator, 'Storage');

  bottle.constant('setTimeout', window.setTimeout);
  bottle.constant('clearTimeout', window.clearTimeout);
  bottle.serviceFactory('useTimeoutToggle', useTimeoutToggle, 'setTimeout', 'clearTimeout');
}
