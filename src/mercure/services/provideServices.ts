import { prop } from 'ramda';
import type Bottle from 'bottlejs';
import { mercureInfoReducerCreator } from '../reducers/mercureInfo';

const provideServices = (bottle: Bottle) => {
  // Reducer
  bottle.serviceFactory('mercureInfoReducerCreator', mercureInfoReducerCreator, 'buildShlinkApiClient');
  bottle.serviceFactory('mercureInfoReducer', prop('reducer'), 'mercureInfoReducerCreator');

  // Actions
  bottle.serviceFactory('loadMercureInfo', prop('loadMercureInfo'), 'mercureInfoReducerCreator');
};

export default provideServices;
