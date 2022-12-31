import { createSlice, PayloadAction, PrepareAction } from '@reduxjs/toolkit';
import { mergeDeepRight } from 'ramda';
import { Theme } from '../../utils/theme';
import { DateInterval } from '../../utils/helpers/dateIntervals';
import { TagsOrder } from '../../tags/data/TagsListChildrenProps';
import { ShortUrlsOrder } from '../../short-urls/data';

export const DEFAULT_SHORT_URLS_ORDERING: ShortUrlsOrder = {
  field: 'dateCreated',
  dir: 'DESC',
};

/**
 * Important! When adding new props in the main Settings interface or any of the nested props, they have to be set as
 * optional, as old instances of the app will load partial objects from local storage until it is saved again.
 */

export interface RealTimeUpdatesSettings {
  enabled: boolean;
  interval?: number;
}

export type TagFilteringMode = 'startsWith' | 'includes';

export interface ShortUrlCreationSettings {
  validateUrls: boolean;
  tagFilteringMode?: TagFilteringMode;
  forwardQuery?: boolean;
}

export interface UiSettings {
  theme: Theme;
}

export interface VisitsSettings {
  defaultInterval: DateInterval;
  excludeBots?: boolean;
}

export interface TagsSettings {
  defaultOrdering?: TagsOrder;
}

export interface ShortUrlsListSettings {
  defaultOrdering?: ShortUrlsOrder;
}

export interface Settings {
  realTimeUpdates: RealTimeUpdatesSettings;
  shortUrlCreation?: ShortUrlCreationSettings;
  shortUrlsList?: ShortUrlsListSettings;
  ui?: UiSettings;
  visits?: VisitsSettings;
  tags?: TagsSettings;
}

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
    setShortUrlsListSettings: toReducer((shortUrlsList: ShortUrlsListSettings) => toPreparedAction({ shortUrlsList })),
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
