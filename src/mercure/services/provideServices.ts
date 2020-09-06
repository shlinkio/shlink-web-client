import Bottle from 'bottlejs';
import { loadMercureInfo } from '../reducers/mercureInfo';

const provideServices = (bottle: Bottle) => {
  // Actions
  bottle.serviceFactory('loadMercureInfo', loadMercureInfo, 'buildShlinkApiClient');
};

export default provideServices;
