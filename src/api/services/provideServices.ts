import Bottle from 'bottlejs';
import { buildShlinkApiClient } from './ShlinkApiClientBuilder';

const provideServices = (bottle: Bottle) => {
  bottle.serviceFactory('buildShlinkApiClient', buildShlinkApiClient, 'axios');
};

export default provideServices;
