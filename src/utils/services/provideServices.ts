import Bottle from 'bottlejs';
import { useTimeoutToggle } from '../helpers/hooks';
import { LocalStorage } from './LocalStorage';
import { ColorGenerator } from './ColorGenerator';
import { csvToJson, jsonToCsv } from '../helpers/csvjson';

const provideServices = (bottle: Bottle) => {
  bottle.constant('localStorage', window.localStorage);
  bottle.service('Storage', LocalStorage, 'localStorage');
  bottle.service('ColorGenerator', ColorGenerator, 'Storage');

  bottle.constant('csvToJson', csvToJson);
  bottle.constant('jsonToCsv', jsonToCsv);

  bottle.constant('setTimeout', window.setTimeout);
  bottle.constant('clearTimeout', window.clearTimeout);
  bottle.serviceFactory('useTimeoutToggle', useTimeoutToggle, 'setTimeout', 'clearTimeout');
};

export default provideServices;
