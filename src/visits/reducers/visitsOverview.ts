import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { ShlinkApiClientBuilder } from '../../api/services/ShlinkApiClientBuilder';
import type { ShlinkVisitsOverview } from '../../api/types';
import { createAsyncThunk } from '../../utils/helpers/redux';
import { groupNewVisitsByType } from '../types/helpers';
import { createNewVisits } from './visitCreation';

const REDUCER_PREFIX = 'shlink/visitsOverview';

export interface VisitsOverview {
  visitsCount: number;
  orphanVisitsCount: number;
  loading: boolean;
  error: boolean;
}

export type GetVisitsOverviewAction = PayloadAction<ShlinkVisitsOverview>;

const initialState: VisitsOverview = {
  visitsCount: 0,
  orphanVisitsCount: 0,
  loading: false,
  error: false,
};

export const loadVisitsOverview = (buildShlinkApiClient: ShlinkApiClientBuilder) => createAsyncThunk(
  `${REDUCER_PREFIX}/loadVisitsOverview`,
  (_: void, { getState }): Promise<ShlinkVisitsOverview> => buildShlinkApiClient(getState).getVisitsOverview(),
);

export const visitsOverviewReducerCreator = (
  loadVisitsOverviewThunk: ReturnType<typeof loadVisitsOverview>,
) => createSlice({
  name: REDUCER_PREFIX,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadVisitsOverviewThunk.pending, () => ({ ...initialState, loading: true }));
    builder.addCase(loadVisitsOverviewThunk.rejected, () => ({ ...initialState, error: true }));
    builder.addCase(loadVisitsOverviewThunk.fulfilled, (_, { payload }) => ({ ...initialState, ...payload }));

    builder.addCase(createNewVisits, ({ visitsCount, orphanVisitsCount = 0, ...rest }, { payload }) => {
      const { createdVisits } = payload;
      const { regularVisits, orphanVisits } = groupNewVisitsByType(createdVisits);
      return {
        ...rest,
        visitsCount: visitsCount + regularVisits.length,
        orphanVisitsCount: orphanVisitsCount + orphanVisits.length,
      };
    });
  },
});
