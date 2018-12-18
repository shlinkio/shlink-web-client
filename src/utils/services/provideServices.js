import axios from 'axios';
import Storage from './Storage';
import ColorGenerator from './ColorGenerator';
import buildShlinkApiClient from './ShlinkApiClientBuilder';

const provideServices = (bottle) => {
  bottle.constant('localStorage', global.localStorage);
  bottle.service('Storage', Storage, 'localStorage');
  bottle.service('ColorGenerator', ColorGenerator, 'Storage');

  bottle.constant('axios', axios);
  bottle.serviceFactory('buildShlinkApiClient', buildShlinkApiClient, 'axios');
};

export default provideServices;
