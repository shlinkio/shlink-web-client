import Bottle from 'bottlejs';
import { buildShlinkApiClient } from './ShlinkApiClientBuilder';

const provideServices = (bottle: Bottle) => {
  bottle.serviceFactory('buildShlinkApiClient', buildShlinkApiClient, 'jsonFetch');
};

export default provideServices;
