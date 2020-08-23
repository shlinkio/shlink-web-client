import axios from 'axios';
import Bottle from 'bottlejs';
import { useStateFlagTimeout } from '../helpers/hooks';
import Storage from './Storage';
import ColorGenerator from './ColorGenerator';
import buildShlinkApiClient from './ShlinkApiClientBuilder';

const provideServices = (bottle: Bottle) => {
  bottle.constant('localStorage', (global as any).localStorage);
  bottle.service('Storage', Storage, 'localStorage');
  bottle.service('ColorGenerator', ColorGenerator, 'Storage');

  bottle.constant('axios', axios);
  bottle.serviceFactory('buildShlinkApiClient', buildShlinkApiClient, 'axios');

  bottle.constant('setTimeout', global.setTimeout);
  bottle.constant('clearTimeout', global.clearTimeout);
  bottle.serviceFactory('useStateFlagTimeout', useStateFlagTimeout, 'setTimeout', 'clearTimeout');
};

export default provideServices;
