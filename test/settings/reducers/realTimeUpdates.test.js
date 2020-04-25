import reducer, {
  LOAD_REAL_TIME_UPDATES,
  loadRealTimeUpdates,
  setRealTimeUpdates,
} from '../../../src/settings/reducers/realTimeUpdates';

describe('realTimeUpdatesReducer', () => {
  const SettingsServiceMock = {
    updateSettings: jest.fn(),
    loadSettings: jest.fn(),
  };

  afterEach(jest.clearAllMocks);

  describe('reducer', () => {
    it('returns realTimeUpdates when action is LOAD_REAL_TIME_UPDATES', () => {
      expect(reducer({}, { type: LOAD_REAL_TIME_UPDATES, enabled: true })).toEqual({ enabled: true });
    });
  });

  describe('loadRealTimeUpdates', () => {
    it.each([
      [{}, true ],
      [{ realTimeUpdates: {} }, true ],
      [{ realTimeUpdates: { enabled: true } }, true ],
      [{ realTimeUpdates: { enabled: false } }, false ],
    ])('loads settings and returns LOAD_REAL_TIME_UPDATES action', (loadedSettings, expectedEnabled) => {
      SettingsServiceMock.loadSettings.mockReturnValue(loadedSettings);

      const result = loadRealTimeUpdates(SettingsServiceMock)();

      expect(result).toEqual({ type: LOAD_REAL_TIME_UPDATES, enabled: expectedEnabled });
      expect(SettingsServiceMock.loadSettings).toHaveBeenCalled();
    });
  });

  describe('setRealTimeUpdates', () => {
    it.each([[ true ], [ false ]])('updates settings with provided value and then loads updates again', (enabled) => {
      const loadRealTimeUpdatesAction = jest.fn();

      setRealTimeUpdates(SettingsServiceMock, loadRealTimeUpdatesAction)(enabled);

      expect(SettingsServiceMock.updateSettings).toHaveBeenCalledWith({ realTimeUpdates: { enabled } });
      expect(loadRealTimeUpdatesAction).toHaveBeenCalled();
    });
  });
});
