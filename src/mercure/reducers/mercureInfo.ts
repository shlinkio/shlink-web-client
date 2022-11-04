import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ShlinkMercureInfo } from '../../api/types';
import { ShlinkState } from '../../container/types';
import { ShlinkApiClientBuilder } from '../../api/services/ShlinkApiClientBuilder';

const GET_MERCURE_INFO = 'shlink/mercure/GET_MERCURE_INFO';

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
  const loadMercureInfo = createAsyncThunk<ShlinkMercureInfo, void, { state: ShlinkState }>(
    GET_MERCURE_INFO,
    async (_, { getState }) => {
      const { settings } = getState();
      if (!settings.realTimeUpdates.enabled) {
        throw new Error('Real time updates not enabled');
      }

      return buildShlinkApiClient(getState).mercureInfo();
    },
  );

  const { reducer } = createSlice({
    name: 'mercureInfoReducer',
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
