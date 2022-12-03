import { createSlice } from '@reduxjs/toolkit';

export interface Sidebar {
  sidebarPresent: boolean;
}

const initialState: Sidebar = {
  sidebarPresent: false,
};

const { actions, reducer } = createSlice({
  name: 'shlink/sidebar',
  initialState,
  reducers: {
    sidebarPresent: () => ({ sidebarPresent: true }),
    sidebarNotPresent: () => ({ sidebarPresent: false }),
  },
});

export const { sidebarPresent, sidebarNotPresent } = actions;

export const sidebarReducer = reducer;
