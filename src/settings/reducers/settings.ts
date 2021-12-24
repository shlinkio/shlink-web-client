import { Action } from 'redux';
import { dissoc, mergeDeepRight } from 'ramda';
import { buildReducer } from '../../utils/helpers/redux';
import { RecursivePartial } from '../../utils/utils';
import { Theme } from '../../utils/theme';
import { DateInterval } from '../../utils/dates/types';
import { TagsOrder } from '../../tags/data/TagsListChildrenProps';
import { ShortUrlsOrder } from '../../short-urls/reducers/shortUrlsListParams';

export const SET_SETTINGS = 'shlink/realTimeUpdates/SET_SETTINGS';

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

export type TagsMode = 'cards' | 'list';

export interface UiSettings {
  theme: Theme;
}

export interface VisitsSettings {
  defaultInterval: DateInterval;
}

export interface TagsSettings {
  defaultOrdering?: TagsOrder;
  defaultMode?: TagsMode;
}

export interface ShortUrlListSettings {
  defaultOrdering?: ShortUrlsOrder;
}

export interface Settings {
  realTimeUpdates: RealTimeUpdatesSettings;
  shortUrlCreation?: ShortUrlCreationSettings;
  shortUrlList?: ShortUrlListSettings;
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
};

type SettingsAction = Action & Settings;

type PartialSettingsAction = Action & RecursivePartial<Settings>;

export default buildReducer<Settings, SettingsAction>({
  [SET_SETTINGS]: (state, action) => mergeDeepRight(state, dissoc('type', action)),
}, initialState);

export const toggleRealTimeUpdates = (enabled: boolean): PartialSettingsAction => ({
  type: SET_SETTINGS,
  realTimeUpdates: { enabled },
});

export const setRealTimeUpdatesInterval = (interval: number): PartialSettingsAction => ({
  type: SET_SETTINGS,
  realTimeUpdates: { interval },
});

export const setShortUrlCreationSettings = (settings: ShortUrlCreationSettings): PartialSettingsAction => ({
  type: SET_SETTINGS,
  shortUrlCreation: settings,
});

export const setUiSettings = (settings: UiSettings): PartialSettingsAction => ({
  type: SET_SETTINGS,
  ui: settings,
});

export const setVisitsSettings = (settings: VisitsSettings): PartialSettingsAction => ({
  type: SET_SETTINGS,
  visits: settings,
});

export const setTagsSettings = (settings: TagsSettings): PartialSettingsAction => ({
  type: SET_SETTINGS,
  tags: settings,
});
