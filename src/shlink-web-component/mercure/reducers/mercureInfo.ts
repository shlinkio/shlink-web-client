import { createSlice } from '@reduxjs/toolkit';
import type { ShlinkApiClientBuilder } from '../../../api/services/ShlinkApiClientBuilder';
import type { ShlinkMercureInfo } from '../../../api/types';
import { createAsyncThunk } from '../../../utils/helpers/redux';

const REDUCER_PREFIX = 'shlink/mercure';

export interface MercureInfo extends Partial<ShlinkMercureInfo> {
  interval?: number;
  loading: boolean;
  error: boolean;
}

const initialState: MercureInfo = {
  loading: true,
  error: false,
};

export const mercureInfoReducerCreator = (buildShlinkApiClient: ShlinkApiClientBuilder) => {
  const loadMercureInfo = createAsyncThunk(
    `${REDUCER_PREFIX}/loadMercureInfo`,
    (_: void, { getState }): Promise<ShlinkMercureInfo> => {
      const { settings } = getState();
      if (!settings.realTimeUpdates.enabled) {
        throw new Error('Real time updates not enabled');
      }

      return buildShlinkApiClient(getState).mercureInfo();
    },
  );

  const { reducer } = createSlice({
    name: REDUCER_PREFIX,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder.addCase(loadMercureInfo.pending, (state) => ({ ...state, loading: true, error: false }));
      builder.addCase(loadMercureInfo.rejected, (state) => ({ ...state, loading: false, error: true }));
      builder.addCase(loadMercureInfo.fulfilled, (_, { payload }) => ({ ...payload, loading: false, error: false }));
    },
  });

  return { loadMercureInfo, reducer };
};
