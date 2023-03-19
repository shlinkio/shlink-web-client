import {
  DEFAULT_SHORT_URLS_ORDERING,
  setRealTimeUpdatesInterval,
  setShortUrlCreationSettings,
  setShortUrlsListSettings,
  setTagsSettings,
  settingsReducer,
  setUiSettings,
  setVisitsSettings,
  toggleRealTimeUpdates,
} from '../../../src/settings/reducers/settings';

describe('settingsReducer', () => {
  const realTimeUpdates = { enabled: true };
  const shortUrlCreation = { validateUrls: false };
  const ui = { theme: 'light' };
  const visits = { defaultInterval: 'last30Days' };
  const shortUrlsList = { defaultOrdering: DEFAULT_SHORT_URLS_ORDERING };
  const settings = { realTimeUpdates, shortUrlCreation, ui, visits, shortUrlsList };

  describe('reducer', () => {
    it('returns realTimeUpdates when action is SET_SETTINGS', () => {
      expect(settingsReducer(undefined, toggleRealTimeUpdates(realTimeUpdates.enabled))).toEqual(settings);
    });
  });

  describe('toggleRealTimeUpdates', () => {
    it.each([[true], [false]])('updates settings with provided value and then loads updates again', (enabled) => {
      const { payload } = toggleRealTimeUpdates(enabled);
      expect(payload).toEqual({ realTimeUpdates: { enabled } });
    });
  });

  describe('setRealTimeUpdatesInterval', () => {
    it.each([[0], [1], [2], [10]])('updates settings with provided value and then loads updates again', (interval) => {
      const { payload } = setRealTimeUpdatesInterval(interval);
      expect(payload).toEqual({ realTimeUpdates: { interval } });
    });
  });

  describe('setShortUrlCreationSettings', () => {
    it('creates action to set shortUrlCreation settings', () => {
      const { payload } = setShortUrlCreationSettings({ validateUrls: true });
      expect(payload).toEqual({ shortUrlCreation: { validateUrls: true } });
    });
  });

  describe('setUiSettings', () => {
    it('creates action to set ui settings', () => {
      const { payload } = setUiSettings({ theme: 'dark' });
      expect(payload).toEqual({ ui: { theme: 'dark' } });
    });
  });

  describe('setVisitsSettings', () => {
    it('creates action to set visits settings', () => {
      const { payload } = setVisitsSettings({ defaultInterval: 'last180Days' });
      expect(payload).toEqual({ visits: { defaultInterval: 'last180Days' } });
    });
  });

  describe('setTagsSettings', () => {
    it('creates action to set tags settings', () => {
      const { payload } = setTagsSettings({ defaultMode: 'list' });
      expect(payload).toEqual({ tags: { defaultMode: 'list' } });
    });
  });

  describe('setShortUrlsListSettings', () => {
    it('creates action to set short URLs list settings', () => {
      const { payload } = setShortUrlsListSettings({ defaultOrdering: DEFAULT_SHORT_URLS_ORDERING });
      expect(payload).toEqual({ shortUrlsList: { defaultOrdering: DEFAULT_SHORT_URLS_ORDERING } });
    });
  });
});
