import type Bottle from 'bottlejs';
import { prop } from 'ramda';
import { mercureInfoReducerCreator } from '../reducers/mercureInfo';

export const provideServices = (bottle: Bottle) => {
  // Reducer
  bottle.serviceFactory('mercureInfoReducerCreator', mercureInfoReducerCreator, 'buildShlinkApiClient');
  bottle.serviceFactory('mercureInfoReducer', prop('reducer'), 'mercureInfoReducerCreator');

  // Actions
  bottle.serviceFactory('loadMercureInfo', prop('loadMercureInfo'), 'mercureInfoReducerCreator');
};
