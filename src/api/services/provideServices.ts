import Bottle from 'bottlejs';
import { buildShlinkApiClient } from './ShlinkApiClientBuilder';

const provideServices = (bottle: Bottle) => {
  bottle.serviceFactory('buildShlinkApiClient', buildShlinkApiClient, 'fetch');
};

export default provideServices;
