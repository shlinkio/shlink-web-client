import reducer, {
  APP_UPDATE_AVAILABLE,
  RESET_APP_UPDATE,
  appUpdateAvailable,
  resetAppUpdate,
} from '../../../src/app/reducers/appUpdates';

describe('appUpdatesReducer', () => {
  describe('reducer', () => {
    it('returns true on APP_UPDATE_AVAILABLE', () => {
      expect(reducer(undefined, { type: APP_UPDATE_AVAILABLE })).toEqual(true);
    });

    it('returns false on RESET_APP_UPDATE', () => {
      expect(reducer(undefined, { type: RESET_APP_UPDATE })).toEqual(false);
    });
  });

  describe('appUpdateAvailable', () => {
    test('creates expected action', () => {
      expect(appUpdateAvailable()).toEqual({ type: APP_UPDATE_AVAILABLE });
    });
  });

  describe('resetAppUpdate', () => {
    test('creates expected action', () => {
      expect(resetAppUpdate()).toEqual({ type: RESET_APP_UPDATE });
    });
  });
});
