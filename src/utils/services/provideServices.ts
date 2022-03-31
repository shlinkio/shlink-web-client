import Bottle from 'bottlejs';
import { useStateFlagTimeout } from '../helpers/hooks';
import LocalStorage from './LocalStorage';
import ColorGenerator from './ColorGenerator';
import { csvToJson, jsonToCsv } from '../helpers/csvjson';

const provideServices = (bottle: Bottle) => {
  bottle.constant('localStorage', (global as any).localStorage);
  bottle.service('Storage', LocalStorage, 'localStorage');
  bottle.service('ColorGenerator', ColorGenerator, 'Storage');

  bottle.constant('csvToJson', csvToJson);
  bottle.constant('jsonToCsv', jsonToCsv);

  bottle.constant('setTimeout', global.setTimeout);
  bottle.constant('clearTimeout', global.clearTimeout);
  bottle.serviceFactory('useStateFlagTimeout', useStateFlagTimeout, 'setTimeout', 'clearTimeout');
};

export default provideServices;
