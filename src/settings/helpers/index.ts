import type { ShlinkState } from '../../container/types';

export const migrateDeprecatedSettings = (state: Partial<ShlinkState>): Partial<ShlinkState> => {
  if (!state.settings) {
    return state;
  }

  // The "last180Days" interval had a typo, with a lowercase d
  if (state.settings.visits && (state.settings.visits.defaultInterval as any) === 'last180days') {
    state.settings.visits.defaultInterval = 'last180Days';
  }

  return state;
};
