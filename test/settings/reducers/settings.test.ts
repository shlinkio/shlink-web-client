import type { Settings } from '@shlinkio/shlink-web-component/settings';
import { fromPartial } from '@total-typescript/shoehorn';
import { DEFAULT_SHORT_URLS_ORDERING, setSettings, settingsReducer } from '../../../src/settings/reducers/settings';

describe('settingsReducer', () => {
  const realTimeUpdates = { enabled: true };
  const shortUrlCreation = { validateUrls: false };
  const ui = { theme: 'light' as const };
  const visits = { defaultInterval: 'last30Days' as const };
  const shortUrlsList = { defaultOrdering: DEFAULT_SHORT_URLS_ORDERING };
  const settings = fromPartial<Settings>({ realTimeUpdates, shortUrlCreation, ui, visits, shortUrlsList });

  describe('reducer', () => {
    it('can update settings', () => {
      expect(settingsReducer(undefined, setSettings(settings))).toEqual(settings);
    });
  });

  describe('setSettings', () => {
    it('creates action to set settings', () => {
      const { payload } = setSettings(settings);
      expect(payload).toEqual(settings);
    });
  });
});
