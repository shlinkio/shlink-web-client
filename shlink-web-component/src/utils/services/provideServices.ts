import type Bottle from 'bottlejs';
import { useTimeoutToggle } from '../helpers/hooks';
import { jsonToCsv } from '../helpers/json';
import { ColorGenerator } from './ColorGenerator';
import { ImageDownloader } from './ImageDownloader';
import { LocalStorage } from './LocalStorage';
import { ReportExporter } from './ReportExporter';

export function provideServices(bottle: Bottle) {
  bottle.constant('window', window);
  bottle.constant('fetch', window.fetch.bind(window));
  bottle.service('ImageDownloader', ImageDownloader, 'fetch', 'window');

  bottle.constant('localStorage', window.localStorage);
  bottle.service('Storage', LocalStorage, 'localStorage');
  bottle.service('ColorGenerator', ColorGenerator, 'Storage');

  bottle.constant('jsonToCsv', jsonToCsv);
  bottle.service('ReportExporter', ReportExporter, 'window', 'jsonToCsv');

  bottle.constant('setTimeout', window.setTimeout);
  bottle.constant('clearTimeout', window.clearTimeout);
  bottle.serviceFactory('useTimeoutToggle', useTimeoutToggle, 'setTimeout', 'clearTimeout');
}
