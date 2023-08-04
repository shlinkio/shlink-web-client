import type { PayloadAction, PrepareAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { mergeDeepRight } from 'ramda';
import type {
  Settings,
  ShortUrlCreationSettings,
  ShortUrlsListSettings,
  TagsSettings,
  UiSettings, VisitsSettings } from '../../../shlink-web-component/src';
import type { Defined } from '../../utils/types';

type ShortUrlsOrder = Defined<ShortUrlsListSettings['defaultOrdering']>;

export const DEFAULT_SHORT_URLS_ORDERING: ShortUrlsOrder = {
  field: 'dateCreated',
  dir: 'DESC',
};

const initialState: Settings = {
  realTimeUpdates: {
    enabled: true,
  },
  shortUrlCreation: {
    validateUrls: false,
  },
  ui: {
    theme: 'light',
  },
  visits: {
    defaultInterval: 'last30Days',
  },
  shortUrlsList: {
    defaultOrdering: DEFAULT_SHORT_URLS_ORDERING,
  },
};

type SettingsAction = PayloadAction<Settings>;
type SettingsPrepareAction = PrepareAction<Settings>;

const commonReducer = (state: Settings, { payload }: SettingsAction) => mergeDeepRight(state, payload);
const toReducer = (prepare: SettingsPrepareAction) => ({ reducer: commonReducer, prepare });
const toPreparedAction: SettingsPrepareAction = (payload: Settings) => ({ payload });

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
