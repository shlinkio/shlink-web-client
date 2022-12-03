import { createSlice } from '@reduxjs/toolkit';

const { actions, reducer } = createSlice({
  name: 'shlink/appUpdates',
  initialState: false,
  reducers: {
    appUpdateAvailable: () => true,
    resetAppUpdate: () => false,
  },
});

export const { appUpdateAvailable, resetAppUpdate } = actions;

export const appUpdatesReducer = reducer;
