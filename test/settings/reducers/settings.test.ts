import reducer, {
  SET_SETTINGS,
  toggleRealTimeUpdates,
  setRealTimeUpdatesInterval,
  setShortUrlCreationSettings,
  setUiSettings,
  setVisitsSettings,
} from '../../../src/settings/reducers/settings';

describe('settingsReducer', () => {
  const realTimeUpdates = { enabled: true };
  const shortUrlCreation = { validateUrls: false };
  const ui = { theme: 'light' };
  const visits = { defaultInterval: 'last30Days' };
  const settings = { realTimeUpdates, shortUrlCreation, ui, visits };

  describe('reducer', () => {
    it('returns realTimeUpdates when action is SET_SETTINGS', () => {
      expect(reducer(undefined, { type: SET_SETTINGS, realTimeUpdates })).toEqual(settings);
    });
  });

  describe('toggleRealTimeUpdates', () => {
    it.each([[ true ], [ false ]])('updates settings with provided value and then loads updates again', (enabled) => {
      const result = toggleRealTimeUpdates(enabled);

      expect(result).toEqual({ type: SET_SETTINGS, realTimeUpdates: { enabled } });
    });
  });

  describe('setRealTimeUpdatesInterval', () => {
    it.each([[ 0 ], [ 1 ], [ 2 ], [ 10 ]])('updates settings with provided value and then loads updates again', (interval) => {
      const result = setRealTimeUpdatesInterval(interval);

      expect(result).toEqual({ type: SET_SETTINGS, realTimeUpdates: { interval } });
    });
  });

  describe('setShortUrlCreationSettings', () => {
    it('creates action to set shortUrlCreation settings', () => {
      const result = setShortUrlCreationSettings({ validateUrls: true });

      expect(result).toEqual({ type: SET_SETTINGS, shortUrlCreation: { validateUrls: true } });
    });
  });

  describe('setUiSettings', () => {
    it('creates action to set ui settings', () => {
      const result = setUiSettings({ theme: 'dark' });

      expect(result).toEqual({ type: SET_SETTINGS, ui: { theme: 'dark' } });
    });
  });

  describe('setVisitsSettings', () => {
    it('creates action to set visits settings', () => {
      const result = setVisitsSettings({ defaultInterval: 'last180Days' });

      expect(result).toEqual({ type: SET_SETTINGS, visits: { defaultInterval: 'last180Days' } });
    });
  });
});
