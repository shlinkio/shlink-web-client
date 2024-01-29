import type { PayloadAction, PrepareAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { mergeDeepRight } from '@shlinkio/data-manipulation';
import type { Theme } from '@shlinkio/shlink-frontend-kit';
import { getSystemPreferredTheme } from '@shlinkio/shlink-frontend-kit';
import type {
  Settings,
  ShortUrlCreationSettings,
  ShortUrlsListSettings,
  TagsSettings,
  VisitsSettings,
} from '@shlinkio/shlink-web-component';
import type { Defined } from '../../utils/types';

type ShortUrlsOrder = Defined<ShortUrlsListSettings['defaultOrdering']>;

export const DEFAULT_SHORT_URLS_ORDERING: ShortUrlsOrder = {
  field: 'dateCreated',
  dir: 'DESC',
};

export type UiSettings = {
  theme: Theme;
};

export type AppSettings = Settings & {
  ui?: UiSettings;
};

const initialState: AppSettings = {
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

type SettingsAction = PayloadAction<AppSettings>;
type SettingsPrepareAction = PrepareAction<AppSettings>;

const commonReducer = (state: AppSettings, { payload }: SettingsAction) => mergeDeepRight(state, payload);
const toReducer = (prepare: SettingsPrepareAction) => ({ reducer: commonReducer, prepare });
const toPreparedAction: SettingsPrepareAction = (payload: AppSettings) => ({ payload });

const { reducer, actions } = createSlice({
  name: 'shlink/settings',
  initialState,
  reducers: {
    toggleRealTimeUpdates: toReducer((enabled: boolean) => toPreparedAction({ realTimeUpdates: { enabled } })),
    setRealTimeUpdatesInterval: toReducer((interval: number) => toPreparedAction({ realTimeUpdates: { interval } })),
    setShortUrlCreationSettings: toReducer(
      (shortUrlCreation: ShortUrlCreationSettings) => toPreparedAction({ shortUrlCreation }),
    ),
    setShortUrlsListSettings: toReducer(
      (shortUrlsList: ShortUrlsListSettings) => toPreparedAction({ shortUrlsList }),
    ),
    setUiSettings: toReducer((ui: UiSettings) => toPreparedAction({ ui })),
    setVisitsSettings: toReducer((visits: VisitsSettings) => toPreparedAction({ visits })),
    setTagsSettings: toReducer((tags: TagsSettings) => toPreparedAction({ tags })),
  },
});

export const {
  toggleRealTimeUpdates,
  setRealTimeUpdatesInterval,
  setShortUrlCreationSettings,
  setShortUrlsListSettings,
  setUiSettings,
  setVisitsSettings,
  setTagsSettings,
} = actions;

export const settingsReducer = reducer;
