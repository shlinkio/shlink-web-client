import reducer, {
  LOAD_REAL_TIME_UPDATES,
  loadRealTimeUpdates,
  setRealTimeUpdates,
} from '../../../src/settings/reducers/settings';

describe('settingsReducer', () => {
  const SettingsServiceMock = {
    updateSettings: jest.fn(),
    loadSettings: jest.fn(),
  };
  const realTimeUpdates = { enabled: true };

  afterEach(jest.clearAllMocks);

  describe('reducer', () => {
    it('returns realTimeUpdates when action is LOAD_REAL_TIME_UPDATES', () => {
      expect(reducer({}, { type: LOAD_REAL_TIME_UPDATES, realTimeUpdates })).toEqual({ realTimeUpdates });
    });
  });

  describe('loadRealTimeUpdates', () => {
    it.each([[ true ], [ false ]])('loads settings and returns LOAD_REAL_TIME_UPDATES action', (enabled) => {
      const realTimeUpdates = { enabled };

      SettingsServiceMock.loadSettings.mockReturnValue({ realTimeUpdates });

      const result = loadRealTimeUpdates(SettingsServiceMock)();

      expect(result).toEqual({
        type: LOAD_REAL_TIME_UPDATES,
        realTimeUpdates,
      });
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
