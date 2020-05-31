import axios from 'axios';
import { useStateFlagTimeout } from '../helpers/hooks';
import Storage from './Storage';
import ColorGenerator from './ColorGenerator';
import buildShlinkApiClient from './ShlinkApiClientBuilder';

const provideServices = (bottle) => {
  bottle.constant('localStorage', global.localStorage);
  bottle.service('Storage', Storage, 'localStorage');
  bottle.service('ColorGenerator', ColorGenerator, 'Storage');

  bottle.constant('axios', axios);
  bottle.serviceFactory('buildShlinkApiClient', buildShlinkApiClient, 'axios');

  bottle.constant('setTimeout', global.setTimeout);
  bottle.constant('clearTimeout', global.clearTimeout);
  bottle.serviceFactory('useStateFlagTimeout', useStateFlagTimeout, 'setTimeout', 'clearTimeout');
};

export default provideServices;
