import { createSlice } from '@reduxjs/toolkit';
import type { ShlinkApiClient, ShlinkMercureInfo } from '../../api-contract';
import { createAsyncThunk } from '../../utils/redux';

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

export const mercureInfoReducerCreator = (apiClientFactory: () => ShlinkApiClient) => {
  const loadMercureInfo = createAsyncThunk(
    `${REDUCER_PREFIX}/loadMercureInfo`,
    (): Promise<ShlinkMercureInfo> =>
    // FIXME Get settings here somehow, as they are only available via hook
    // const { settings } = getState();
    // if (!settings.realTimeUpdates.enabled) {
    //   throw new Error('Real time updates not enabled');
    // }

      apiClientFactory().mercureInfo()
    ,
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
