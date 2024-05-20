import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { mergeDeepRight } from '@shlinkio/data-manipulation';
import { getSystemPreferredTheme } from '@shlinkio/shlink-frontend-kit';
import type { Settings, ShortUrlsListSettings } from '@shlinkio/shlink-web-component/settings';
import type { Defined } from '../../utils/types';

type ShortUrlsOrder = Defined<ShortUrlsListSettings['defaultOrdering']>;

export const DEFAULT_SHORT_URLS_ORDERING: ShortUrlsOrder = {
  field: 'dateCreated',
  dir: 'DESC',
};

type SettingsAction = PayloadAction<Settings>;

const initialState: Settings = {
  realTimeUpdates: {
    enabled: true,
  },
  shortUrlCreation: {
    validateUrls: false,
  },
  ui: {
    theme: getSystemPreferredTheme(),
  },
  visits: {
    defaultInterval: 'last30Days',
  },
  shortUrlsList: {
    defaultOrdering: DEFAULT_SHORT_URLS_ORDERING,
  },
};

const { reducer, actions } = createSlice({
  name: 'shlink/settings',
  initialState,
  reducers: {
    setSettings: (state: Settings, { payload }: SettingsAction) => mergeDeepRight(state, payload),
  },
});

export const { setSettings } = actions;

export const settingsReducer = reducer;
