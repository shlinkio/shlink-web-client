import reducer, { SET_REAL_TIME_UPDATES, toggleRealTimeUpdates, setRealTimeUpdatesInterval } from '../../../src/settings/reducers/settings';

describe('settingsReducer', () => {
  const realTimeUpdates = { enabled: true };

  describe('reducer', () => {
    it('returns realTimeUpdates when action is SET_REAL_TIME_UPDATES', () => {
      expect(reducer(undefined, { type: SET_REAL_TIME_UPDATES, realTimeUpdates })).toEqual({ realTimeUpdates });
    });
  });

  describe('toggleRealTimeUpdates', () => {
    it.each([[ true ], [ false ]])('updates settings with provided value and then loads updates again', (enabled) => {
      const result = toggleRealTimeUpdates(enabled);

      expect(result).toEqual({ type: SET_REAL_TIME_UPDATES, realTimeUpdates: { enabled } });
    });
  });

  describe('setRealTimeUpdatesInterval', () => {
    it.each([[ 0 ], [ 1 ], [ 2 ], [ 10 ]])('updates settings with provided value and then loads updates again', (interval) => {
      const result = setRealTimeUpdatesInterval(interval);

      expect(result).toEqual({ type: SET_REAL_TIME_UPDATES, realTimeUpdates: { interval } });
    });
  });
});
