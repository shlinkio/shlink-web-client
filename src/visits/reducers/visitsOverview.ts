import { Action, Dispatch } from 'redux';
import { ShlinkVisitsOverview } from '../../api/types';
import { ShlinkApiClientBuilder } from '../../api/services/ShlinkApiClientBuilder';
import { GetState } from '../../container/types';
import { buildReducer } from '../../utils/helpers/redux';
import { groupNewVisitsByType } from '../types/helpers';
import { CREATE_VISITS, CreateVisitsAction } from './visitCreation';

export const GET_OVERVIEW_START = 'shlink/visitsOverview/GET_OVERVIEW_START';
export const GET_OVERVIEW_ERROR = 'shlink/visitsOverview/GET_OVERVIEW_ERROR';
export const GET_OVERVIEW = 'shlink/visitsOverview/GET_OVERVIEW';

export interface VisitsOverview {
  visitsCount: number;
  orphanVisitsCount?: number;
  loading: boolean;
  error: boolean;
}

export type GetVisitsOverviewAction = ShlinkVisitsOverview & Action<string>;

const initialState: VisitsOverview = {
  visitsCount: 0,
  orphanVisitsCount: 0,
  loading: false,
  error: false,
};

export default buildReducer<VisitsOverview, GetVisitsOverviewAction & CreateVisitsAction>({
  [GET_OVERVIEW_START]: () => ({ ...initialState, loading: true }),
  [GET_OVERVIEW_ERROR]: () => ({ ...initialState, error: true }),
  [GET_OVERVIEW]: (_, { visitsCount, orphanVisitsCount }) => ({ ...initialState, visitsCount, orphanVisitsCount }),
  [CREATE_VISITS]: ({ visitsCount, orphanVisitsCount = 0, ...rest }, { createdVisits }) => {
    const { regularVisits, orphanVisits } = groupNewVisitsByType(createdVisits);

    return {
      ...rest,
      visitsCount: visitsCount + regularVisits.length,
      orphanVisitsCount: orphanVisitsCount + orphanVisits.length,
    };
  },
}, initialState);

export const loadVisitsOverview = (buildShlinkApiClient: ShlinkApiClientBuilder) => () => async (
  dispatch: Dispatch,
  getState: GetState,
) => {
  dispatch({ type: GET_OVERVIEW_START });

  try {
    const { getVisitsOverview } = buildShlinkApiClient(getState);
    const result = await getVisitsOverview();

    dispatch({ type: GET_OVERVIEW, ...result });
  } catch (e) {
    dispatch({ type: GET_OVERVIEW_ERROR });
  }
};
