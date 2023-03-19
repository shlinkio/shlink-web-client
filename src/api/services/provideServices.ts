import type Bottle from 'bottlejs';
import { buildShlinkApiClient } from './ShlinkApiClientBuilder';

export const provideServices = (bottle: Bottle) => {
  bottle.serviceFactory('buildShlinkApiClient', buildShlinkApiClient, 'HttpClient');
};
