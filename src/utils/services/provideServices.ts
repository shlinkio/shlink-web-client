import { useTimeoutToggle } from '@shlinkio/shlink-frontend-kit';
import type Bottle from 'bottlejs';
import { csvToJson, jsonToCsv } from '../helpers/csvjson';
import { LocalStorage } from './LocalStorage';
import { TagColorsStorage } from './TagColorsStorage';

export const provideServices = (bottle: Bottle) => {
  bottle.constant('localStorage', window.localStorage);
  bottle.service('Storage', LocalStorage, 'localStorage');
  bottle.service('TagColorsStorage', TagColorsStorage, 'Storage');

  bottle.constant('csvToJson', csvToJson);
  bottle.constant('jsonToCsv', jsonToCsv);

  bottle.serviceFactory('useTimeoutToggle', () => useTimeoutToggle);
};
