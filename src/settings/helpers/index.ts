import { ShlinkState } from '../../container/types';

/* eslint-disable no-param-reassign */
export const migrateDeprecatedSettings = (state: Partial<ShlinkState>): Partial<ShlinkState> => {
  if (!state.settings) {
    return state;
  }

  // The "last180Days" interval had a typo, with a lowercase d
  if ((state.settings.visits?.defaultInterval as any) === 'last180days') {
    state.settings.visits && (state.settings.visits.defaultInterval = 'last180Days');
  }

  // The "tags display mode" option has been moved from "ui" to "tags"
  state.settings.tags = {
    ...state.settings.tags,
    defaultMode: state.settings.tags?.defaultMode ?? (state.settings.ui as any)?.tagsMode,
  };
  state.settings.ui && delete (state.settings.ui as any).tagsMode;

  return state;
};
