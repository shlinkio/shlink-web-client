import { createSlice } from '@reduxjs/toolkit';

// TODO This is only used for some components to have extra paddings/styles if existing section has a side menu
//      Now that's basically the route which renders ShlinkWebComponent, so maybe there's some way to re-think this
//      logic, and perhaps get rid of a reducer just for that

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
