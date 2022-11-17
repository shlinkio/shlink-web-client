import Bottle from 'bottlejs';
import { buildShlinkApiClient } from './ShlinkApiClientBuilder';

const provideServices = (bottle: Bottle) => {
  bottle.serviceFactory('buildShlinkApiClient', buildShlinkApiClient, 'HttpClient');
};

export default provideServices;
