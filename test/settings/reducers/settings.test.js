import reducer, { SET_REAL_TIME_UPDATES, setRealTimeUpdates } from '../../../src/settings/reducers/settings';

describe('settingsReducer', () => {
  const realTimeUpdates = { enabled: true };

  describe('reducer', () => {
    it('returns realTimeUpdates when action is SET_REAL_TIME_UPDATES', () => {
      expect(reducer({}, { type: SET_REAL_TIME_UPDATES, realTimeUpdates })).toEqual({ realTimeUpdates });
    });
  });

  describe('setRealTimeUpdates', () => {
    it.each([[ true ], [ false ]])('updates settings with provided value and then loads updates again', (enabled) => {
      const result = setRealTimeUpdates(enabled);

      expect(result).toEqual({ type: SET_REAL_TIME_UPDATES, realTimeUpdates: { enabled } });
    });
  });
});
