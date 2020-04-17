import { loadMercureInfo } from '../reducers/mercureInfo';

const provideServices = (bottle) => {
  // Actions
  bottle.serviceFactory('loadMercureInfo', loadMercureInfo, 'buildShlinkApiClient');
};

export default provideServices;
